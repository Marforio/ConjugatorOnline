import { houseElements, LocationAndMaterials, CitiesAndBuildings, LightSpaces, ArchCareer, AdjectivesForReviews } from "./ArchitectureVocab";
import { civilVerbs, constructionSite, ConstructionScience, EarthAndMaterials, CitiesInfrastructureBuildings, DimensionsAndProperties, BusinessReports } from "./CivilVocab"
import { irregularVerbs } from "./IrregularVerbs";

export const vocabLists = {
  irregular_verbs: {
    title: "Irregular Verbs",
    module: "Irregular verbs",
    data: irregularVerbs,
    supportsLevels: true,
  },
  house_elements: {
    title: "House Elements",
    module: "Architecture",
    data: houseElements,
    supportsLevels: false,
  },
  locations_materials: {
    title: "Locations and Materials",
    module: "Architecture",
    data: LocationAndMaterials,
    supportsLevels: false,
  },
  cities_buildings: {
    title: "Cities and Buildings",
    module: "Architecture",
    data: CitiesAndBuildings,
    supportsLevels: false,
  },
  light_spaces: {
    title: "Light and Spaces",
    module: "Architecture",
    data: LightSpaces,
    supportsLevels: false,
  },
  adjectives_reviews: {
    title: "Adjectives for Reviews",
    module: "Architecture",
    data: AdjectivesForReviews,
    supportsLevels: false,
  },
  career_arch: {
    title: "Being an Architect",
    module: "Architecture",
    data: ArchCareer,
    supportsLevels: false,
  },
  civil_verbs: {
    title: "Verbs for Civil Engineering",
    module: "Civil",
    data: civilVerbs,
    supportsLevels: false,
  },
  construction_site: {
    title: "The Construction Site",
    module: "Civil",
    data: constructionSite,
    supportsLevels: false,
  },
  earth_and_materials: {
    title: "Earth and Materials",
    module: "Civil",
    data: EarthAndMaterials,
    supportsLevels: false,
  },
  cities_infrastructure: {
    title: "Cities and Urban Infrastructure",
    module: "Civil",
    data: CitiesInfrastructureBuildings,
    supportsLevels: false,
  },
  construction_science: {
    title: "Science of Construction",
    module: "Civil",
    data: ConstructionScience,
    supportsLevels: false,
  },
  dimensions_properties_civ: {
    title: "Dimensions and Properties",
    module: "Civil",
    data: DimensionsAndProperties,
    supportsLevels: false,
  },
  construction_business_reports: {
    title: "Business Report (Construction)",
    module: "Civil",
    data: BusinessReports,
    supportsLevels: false,
  }
} as const;
