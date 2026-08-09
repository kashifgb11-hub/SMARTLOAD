"""Feature names, ranges, medians, and other constants for the SmartLoad model."""

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
TRAINED_MODELS_DIR = BASE_DIR / "trained_models"

MODEL_HEATING_PATH = TRAINED_MODELS_DIR / "model_heating_load.joblib"
MODEL_COOLING_PATH = TRAINED_MODELS_DIR / "model_cooling_load.joblib"
SCALER_PATH = TRAINED_MODELS_DIR / "scaler.joblib"
SHAP_EXPLAINER_PATH = TRAINED_MODELS_DIR / "shap_explainer.joblib"

# Canonical feature order — must match the order the scaler/models were trained on.
FEATURE_NAMES = [
    "Relative_Compactness",
    "Surface_Area",
    "Wall_Area",
    "Roof_Area",
    "Overall_Height",
    "Orientation",
    "Glazing_Area",
    "Glazing_Dist",
]

# Human-readable labels for explanations / missing-feature reporting.
FEATURE_LABELS = {
    "Relative_Compactness": "Relative Compactness",
    "Surface_Area": "Surface Area",
    "Wall_Area": "Wall Area",
    "Roof_Area": "Roof Area",
    "Overall_Height": "Overall Height",
    "Orientation": "Orientation",
    "Glazing_Area": "Glazing Area",
    "Glazing_Dist": "Glazing Distribution",
}

# Maps Pydantic request field names -> canonical feature names.
REQUEST_FIELD_TO_FEATURE = {
    "relative_compactness": "Relative_Compactness",
    "surface_area": "Surface_Area",
    "wall_area": "Wall_Area",
    "roof_area": "Roof_Area",
    "overall_height": "Overall_Height",
    "orientation": "Orientation",
    "glazing_area": "Glazing_Area",
    "glazing_dist": "Glazing_Dist",
}

# Training medians, used to impute null fields in /predict.
FEATURE_MEDIANS = {
    "Relative_Compactness": 0.75,
    "Surface_Area": 673.75,
    "Wall_Area": 318.5,
    "Roof_Area": 183.75,
    "Overall_Height": 5.25,
    "Orientation": 3.5,
    "Glazing_Area": 0.25,
    "Glazing_Dist": 3.0,
}

# Continuous ranges (min, max) — for reference / validation.
FEATURE_RANGES = {
    "Relative_Compactness": (0.62, 0.98),
    "Surface_Area": (514.5, 808.5),
    "Wall_Area": (245.0, 416.5),
    "Roof_Area": (110.25, 220.5),
    "Overall_Height": (3.5, 7.0),
    "Orientation": (2, 5),
    "Glazing_Area": (0.0, 0.40),
    "Glazing_Dist": (0, 5),
}

# Discrete candidate values to sweep per feature for /optimize.
FEATURE_CANDIDATES = {
    "Relative_Compactness": [0.62, 0.66, 0.69, 0.71, 0.74, 0.76, 0.79, 0.82, 0.86, 0.90, 0.98],
    "Surface_Area": [514.5, 563.5, 588.0, 612.5, 637.0, 661.5, 686.0, 710.5, 735.0, 759.5, 784.0, 808.5],
    "Wall_Area": [245.0, 269.5, 294.0, 318.5, 343.0, 367.5, 416.5],
    "Roof_Area": [110.25, 122.5, 147.0, 220.5],
    "Overall_Height": [3.5, 7.0],
    "Orientation": [2, 3, 4, 5],
    "Glazing_Area": [0.0, 0.10, 0.25, 0.40],
    "Glazing_Dist": [0, 1, 2, 3, 4, 5],
}

# Category labels for features whose numeric codes represent a named option.
ORIENTATION_LABELS = {2: "North", 3: "East", 4: "South", 5: "West"}
GLAZING_DIST_LABELS = {0: "None", 1: "Uniform", 2: "North", 3: "East", 4: "South", 5: "West"}

# How to render each feature's value in a human-readable recommendation string.
# "unit" is appended after the number (e.g. "7.0m"); "percent" renders as a
# whole-number percentage; "category" looks the value up in the given label map.
FEATURE_DISPLAY = {
    "Relative_Compactness": {"kind": "plain", "decimals": 2},
    "Surface_Area": {"kind": "unit", "unit": "m²", "decimals": 1},
    "Wall_Area": {"kind": "unit", "unit": "m²", "decimals": 1},
    "Roof_Area": {"kind": "unit", "unit": "m²", "decimals": 2},
    "Overall_Height": {"kind": "unit", "unit": "m", "decimals": 1},
    "Orientation": {"kind": "category", "labels": ORIENTATION_LABELS},
    "Glazing_Area": {"kind": "percent"},
    "Glazing_Dist": {"kind": "category", "labels": GLAZING_DIST_LABELS},
}
