"""
Resource service for UVic student resources search.
Loads resources from JSON at startup and provides search functionality.
"""

import json
import logging
import re
from pathlib import Path
from typing import Optional

logger = logging.getLogger(__name__)


def build_resource_id(name: str) -> str:
    """Create a stable ID from a resource name."""
    slug = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    return slug or "resource"


class ResourceCard:
    """Represents a UVic student resource."""

    def __init__(
        self,
        name: str,
        description: str,
        categories: list[str],
        url: str,
        location: Optional[str] = None,
        resource_id: Optional[str] = None,
    ):
        self.id = resource_id or build_resource_id(name)
        self.name = name
        self.description = description
        self.categories = categories
        self.url = url
        self.location = location

    def to_dict(self) -> dict:
        """Convert to dictionary for JSON serialization."""
        result = {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "categories": self.categories,
            "url": self.url,
        }
        if self.location:
            result["location"] = self.location
        return result


class ResourceService:
    """Service for loading and searching UVic student resources."""

    def __init__(self):
        self._resources: list[ResourceCard] = []
        self._load_error: Optional[str] = None
        self._loaded = False

    def load_resources(self, json_path: str | Path) -> bool:
        """
        Load resources from JSON file.
        Returns True if successful, False otherwise.
        """
        try:
            path = Path(json_path)
            if not path.exists():
                self._load_error = f"Resource file not found: {json_path}"
                logger.error(self._load_error)
                return False

            with open(path, "r", encoding="utf-8") as f:
                data = json.load(f)

            resources_data = data.get("resources", [])
            self._resources = []

            for item in resources_data:
                resource = ResourceCard(
                    name=item.get("name", ""),
                    description=item.get("description", ""),
                    categories=item.get("categories", []),
                    url=item.get("url", ""),
                    location=item.get("location"),
                    resource_id=item.get("id"),
                )
                self._resources.append(resource)

            self._loaded = True
            self._load_error = None
            logger.info("Loaded %d resources from %s", len(self._resources), json_path)
            return True

        except json.JSONDecodeError as e:
            self._load_error = f"Invalid JSON in resource file: {e}"
            logger.error(self._load_error)
            return False
        except Exception as e:
            self._load_error = f"Failed to load resources: {e}"
            logger.error(self._load_error)
            return False

    @property
    def is_loaded(self) -> bool:
        """Check if resources have been loaded successfully."""
        return self._loaded

    @property
    def load_error(self) -> Optional[str]:
        """Get the load error message if loading failed."""
        return self._load_error

    def _calculate_score(self, resource: ResourceCard, query_lower: str) -> int:
        """
        Calculate relevance score for a resource based on query matches.
        - name match = +3
        - description match = +2
        - category match = +1
        - location match = +1
        """
        score = 0

        # Name match (+3)
        if query_lower in resource.name.lower():
            score += 3

        # Description match (+2)
        if query_lower in resource.description.lower():
            score += 2

        # Category match (+1)
        for category in resource.categories:
            if query_lower in category.lower():
                score += 1
                break  # Only count category match once

        # Location match (+1)
        if resource.location and query_lower in resource.location.lower():
            score += 1

        return score

    def search(self, query: Optional[str], limit: int = 5) -> list[dict]:
        """
        Search resources by query string.
        Returns top `limit` results sorted by score desc, then name asc.
        Returns empty list if query is empty or no matches found.
        """
        if not query or not query.strip():
            return []

        if not self._loaded:
            return []

        query_lower = query.strip().lower()

        # Calculate scores for all resources
        scored_resources: list[tuple[int, str, ResourceCard]] = []
        for resource in self._resources:
            score = self._calculate_score(resource, query_lower)
            if score > 0:
                # Store (negative_score, name, resource) for sorting
                # Negative score for descending order, name for ascending tiebreak
                scored_resources.append((score, resource.name, resource))

        # Sort by score descending, then name ascending
        scored_resources.sort(key=lambda x: (-x[0], x[1]))

        # Return top `limit` results as dictionaries
        results = [resource.to_dict() for _, _, resource in scored_resources[:limit]]
        return results


# Global singleton instance
_resource_service: Optional[ResourceService] = None


def get_resource_service() -> ResourceService:
    """Get the global resource service instance."""
    global _resource_service
    if _resource_service is None:
        _resource_service = ResourceService()
    return _resource_service


def init_resource_service(json_path: str | Path) -> ResourceService:
    """Initialize the resource service with the given JSON path."""
    service = get_resource_service()
    if not service.is_loaded:
        service.load_resources(json_path)
    return service
