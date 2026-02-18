import { houseElements, LocationAndMaterials, CitiesAndBuildings, LightSpaces, ArchCareer, AdjectivesForReviews } from "./ArchitectureVocab";
import { civilVerbs, constructionSite, ConstructionScience, EarthAndMaterials, CitiesInfrastructureBuildings, DimensionsAndProperties, BusinessReports } from "./CivilVocab"
import { productMarketing, promotionAndBusinessDevelopment, meetingExpressions, meetings, businessEthics, sustainability } from "./BusinessVocab";
import { irregularVerbs } from "./IrregularVerbs";

export const vocabLists = {
  ////////////////////////////// GENERAL /////////////////////////////
  irregular_verbs: {
    title: "Irregular Verbs",
    module: "Irregular verbs",
    data: irregularVerbs,
    supportsLevels: true,
  },
  ////////////////////////////// ARCHITECTURE /////////////////////////////
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
  ////////////////////////////// CIVIL ENGINEERING /////////////////////////////
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
  },
  ////////////////////////////// MECHANICAL /////////////////////////////


   meetingExpressionsM: {
    title: "Meeting Expressions",
    module: "Mechanical",
    data: meetingExpressions,
    supportsLevels: false,
  },
  meetingsM: {
    title: "Meetings",
    module: "Mechanical",
    data: meetings,
    supportsLevels: false,
  },

  ////////////////////////////// ELECTRICAL /////////////////////////////

   meetingExpressionsE: {
    title: "Meeting Expressions",
    module: "Electrical",
    data: meetingExpressions,
    supportsLevels: false,
  },
  meetingsE: {
    title: "Meetings",
    module: "Electrical",
    data: meetings,
    supportsLevels: false,
  },

  ////////////////////////////// IT /////////////////////////////

   meetingExpressionsIT: {
    title: "Meeting Expressions",
    module: "Computer_science",
    data: meetingExpressions,
    supportsLevels: false,
  },
  meetingsIT: {
    title: "Meetings",
    module: "Computer_science",
    data: meetings,
    supportsLevels: false,
  },

  ////////////////////////////// CHEMISTRY /////////////////////////////
  ////////////////////////////// BUSINESS 1 /////////////////////////////
 meetingExpressions: {
    title: "Meeting Expressions",
    module: "Business_1",
    data: meetingExpressions,
    supportsLevels: false,
  },
  meetings: {
    title: "Meetings",
    module: "Business_1",
    data: meetings,
    supportsLevels: false,
  },


  ////////////////////////////// BUSINESS 2 /////////////////////////////
    product_marketing: {
    title: "Product Marketing",
    module: "Business_2",
    data: productMarketing, 
    supportsLevels: false,
  },
  promotion_and_business_development: {
    title: "Promotion and Business Development",
    module: "Business_2",
    data: promotionAndBusinessDevelopment,
    supportsLevels: false,
  },

  ////////////////////////////// BUSINESS 3 /////////////////////////////

  ////////////////////////////// BUSINESS 4 /////////////////////////////
  business_ethics: {
    title: "Business Ethics",
    module: "Business_4",
    data: businessEthics,
    supportsLevels: false,
  },
  sustainability: {
    title: "Sustainability",
    module: "Business_4",
    data: sustainability,
    supportsLevels: false,
  }
} as const;
