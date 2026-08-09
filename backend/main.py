"""FastAPI app entry point for the SmartLoad backend."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import FEATURE_LABELS, FEATURE_MEDIANS, REQUEST_FIELD_TO_FEATURE
from app.explainer import explainer
from app.models import (
    HealthResponse,
    OptimizeRequest,
    OptimizeResponse,
    PredictRequest,
    PredictResponse,
)
from app.optimizer import find_recommendations
from app.predictor import predictor

app = FastAPI(title="SmartLoad Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(status="ok", model="Ridge Regression")


@app.post("/predict", response_model=PredictResponse)
def predict(request: PredictRequest) -> PredictResponse:
    request_data = request.model_dump()

    feature_values: dict[str, float] = {}
    missing_features: list[str] = []
    for field_name, feature_name in REQUEST_FIELD_TO_FEATURE.items():
        value = request_data[field_name]
        if value is None:
            feature_values[feature_name] = FEATURE_MEDIANS[feature_name]
            missing_features.append(FEATURE_LABELS[feature_name])
        else:
            feature_values[feature_name] = value

    heating_load, cooling_load, scaled_array = predictor.predict_raw(feature_values)
    shap_values = explainer.compute_shap_values(scaled_array)
    explanation = explainer.generate_explanation(shap_values)

    return PredictResponse(
        heating_load=round(heating_load, 2),
        cooling_load=round(cooling_load, 2),
        missing_count=len(missing_features),
        missing_features=missing_features,
        shap_values={name: round(value, 2) for name, value in shap_values.items()},
        explanation=explanation,
        base_value=round(explainer.base_value, 2),
    )


@app.post("/optimize", response_model=OptimizeResponse)
def optimize(request: OptimizeRequest) -> OptimizeResponse:
    request_data = request.model_dump()
    feature_values = {
        feature_name: request_data[field_name]
        for field_name, feature_name in REQUEST_FIELD_TO_FEATURE.items()
    }

    current_hl, current_cl, recommendations = find_recommendations(feature_values)

    return OptimizeResponse(
        current_heating_load=round(current_hl, 2),
        current_cooling_load=round(current_cl, 2),
        recommendations=recommendations,
    )
