import { houseElements, LocationAndMaterials, CitiesAndBuildings, AdjectivesForReviews } from "./ArchitectureVocab";
import { irregularVerbs } from "./IrregularVerbs";

export const vocabLists = {
  irregular_verbs: {
    title: "Irregular Verbs",
    module: "General English",
    data: irregularVerbs,
    supportsLevels: true,
  },
  house_elements: {
    title: "House Elements",
    module: "Architecture",
    data: houseElements,
    supportsLevels: false,
  },
} as const;
