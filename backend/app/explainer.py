"""SHAP explanation logic.

The trained shap.LinearExplainer explains the heating-load Ridge model.
SHAP values must be computed on the SCALED input (the same input the
Ridge model was trained on), not the raw input.
"""

import json

import joblib
import numpy as np

from app.config import FEATURE_NAMES, FEATURE_LABELS, SHAP_EXPLAINER_PATH, TRAINED_MODELS_DIR

_SHAP_METADATA_PATH = TRAINED_MODELS_DIR / "shap_metadata.json"


class Explainer:
    def __init__(self) -> None:
        self.shap_explainer = joblib.load(SHAP_EXPLAINER_PATH)
        self.base_value = self._load_base_value()

    def _load_base_value(self) -> float:
        expected_value = getattr(self.shap_explainer, "expected_value", None)
        if expected_value is not None:
            value = np.asarray(expected_value).reshape(-1)[0]
            return float(value)
        with open(_SHAP_METADATA_PATH) as f:
            metadata = json.load(f)
        return float(metadata["base_value_hl"])

    def compute_shap_values(self, scaled_array: np.ndarray) -> dict[str, float]:
        raw_shap = self.shap_explainer.shap_values(scaled_array)
        raw_shap = np.asarray(raw_shap).reshape(-1)
        return {name: float(value) for name, value in zip(FEATURE_NAMES, raw_shap)}

    def generate_explanation(self, shap_values: dict[str, float], top_n: int = 3) -> list[str]:
        ranked = sorted(shap_values.items(), key=lambda item: abs(item[1]), reverse=True)
        explanation = []
        for feature_name, value in ranked[:top_n]:
            label = FEATURE_LABELS[feature_name]
            direction = "increasing" if value >= 0 else "decreasing"
            explanation.append(
                f"{label} is {direction} the predicted heating load by {abs(value):.2f} kWh/m²"
            )
        return explanation


explainer = Explainer()
