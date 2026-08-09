"""Pydantic request/response schemas."""

from typing import Optional

from pydantic import BaseModel, Field


class PredictRequest(BaseModel):
    relative_compactness: Optional[float] = Field(None, description="[0.62, 0.98]")
    surface_area: Optional[float] = Field(None, description="[514.5, 808.5] m^2")
    wall_area: Optional[float] = Field(None, description="[245.0, 416.5] m^2")
    roof_area: Optional[float] = Field(None, description="[110.25, 220.5] m^2")
    overall_height: Optional[float] = Field(None, description="3.5 or 7.0 m")
    orientation: Optional[float] = Field(None, description="2=N, 3=E, 4=S, 5=W")
    glazing_area: Optional[float] = Field(None, description="0.0, 0.10, 0.25, 0.40")
    glazing_dist: Optional[float] = Field(None, description="0-5")


class PredictResponse(BaseModel):
    heating_load: float
    cooling_load: float
    missing_count: int
    missing_features: list[str]
    shap_values: dict[str, float]
    explanation: list[str]
    base_value: float


class OptimizeRequest(BaseModel):
    relative_compactness: float = Field(..., description="[0.62, 0.98]")
    surface_area: float = Field(..., description="[514.5, 808.5] m^2")
    wall_area: float = Field(..., description="[245.0, 416.5] m^2")
    roof_area: float = Field(..., description="[110.25, 220.5] m^2")
    overall_height: float = Field(..., description="3.5 or 7.0 m")
    orientation: float = Field(..., description="2=N, 3=E, 4=S, 5=W")
    glazing_area: float = Field(..., description="0.0, 0.10, 0.25, 0.40")
    glazing_dist: float = Field(..., description="0-5")


class Recommendation(BaseModel):
    feature: str
    current_value: float
    suggested_value: float
    current_hl: float
    new_hl: float
    savings: float
    direction: str


class OptimizeResponse(BaseModel):
    current_heating_load: float
    current_cooling_load: float
    recommendations: list[Recommendation]


class HealthResponse(BaseModel):
    status: str
    model: str
