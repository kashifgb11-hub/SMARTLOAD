"""Model loading and prediction logic.

Models are loaded once at import time (triggered from main.py's startup)
and reused across requests instead of being reloaded per call.
"""

import numpy as np
import joblib

from app.config import (
    FEATURE_NAMES,
    MODEL_HEATING_PATH,
    MODEL_COOLING_PATH,
    SCALER_PATH,
)


class Predictor:
    def __init__(self) -> None:
        self.model_heating = joblib.load(MODEL_HEATING_PATH)
        self.model_cooling = joblib.load(MODEL_COOLING_PATH)
        self.scaler = joblib.load(SCALER_PATH)

    def to_feature_array(self, feature_values: dict) -> np.ndarray:
        """Arrange a {feature_name: value} dict into a (1, n_features) array
        in the canonical training order."""
        return np.array([[feature_values[name] for name in FEATURE_NAMES]], dtype=float)

    def scale(self, raw_array: np.ndarray) -> np.ndarray:
        return self.scaler.transform(raw_array)

    def predict_scaled(self, scaled_array: np.ndarray) -> tuple[float, float]:
        heating = float(self.model_heating.predict(scaled_array)[0])
        cooling = float(self.model_cooling.predict(scaled_array)[0])
        return heating, cooling

    def predict_raw(self, feature_values: dict) -> tuple[float, float, np.ndarray]:
        """Scale-then-predict pipeline for a raw feature dict.

        Returns (heating_load, cooling_load, scaled_array) so callers
        (e.g. the SHAP explainer) can reuse the scaled input.
        """
        raw_array = self.to_feature_array(feature_values)
        scaled_array = self.scale(raw_array)
        heating, cooling = self.predict_scaled(scaled_array)
        return heating, cooling, scaled_array


predictor = Predictor()
