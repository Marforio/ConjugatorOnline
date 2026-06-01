// graphGameData.ts

export const TIME_FRAMES = {
  finished: ["in 2022", "from 2014 to 2018", "last year"],
  unfinished: ["so far this year", "since 2022", "in the last 5 years"]
}

export const STRUCTURAL_VERBS = {
  verbs_up: {
    easy: [
      { inf: "increase", ps: "increased", pp: "increased" },
      { inf: "go up", ps: "went up", pp: "gone up" },
      { inf: "climb", ps: "climbed", pp: "climbed" },
      { inf: "explode", ps: "exploded", pp: "exploded" },
      { inf: "rise", ps: "rose", pp: "risen" },
      { inf: "grow", ps: "grew", pp: "grown" },
      { inf: "jump", ps: "jumped", pp: "jumped" }
    ],
    hard: [
      { inf: "shoot up", ps: "shot up", pp: "shot up" },
      { inf: "skyrocket", ps: "skyrocketed", pp: "skyrocketed" }
    ]
  },
  verbs_down: {
    easy: [
      { inf: "go down", ps: "went down", pp: "gone down" },
      { inf: "drop", ps: "dropped", pp: "dropped" },
      { inf: "plunge", ps: "plunged", pp: "plunged" },
      { inf: "collapse", ps: "collapsed", pp: "collapsed" },
      { inf: "fall", ps: "fell", pp: "fallen" },
      { inf: "decrease", ps: "decreased", pp: "decreased" }
    ],
    hard: [
      { inf: "shrink", ps: "shrank", pp: "shrunk" },
      { inf: "slide", ps: "slid", pp: "slid" }
    ]
  },
  verbs_flat: {
    easy: [
      { inf: "fluctuate", ps: "fluctuated", pp: "fluctuated" },
      { inf: "remain steady", ps: "remained steady", pp: "remained steady" },
      { inf: "stay the same", ps: "stayed the same", pp: "stayed the same" }
    ],
    hard: [
      { inf: "range", ps: "ranged", pp: "ranged" }
    ]
  }
}

export const CHART_THEMES = [
  { title: "Net Revenue", yAxis: "Revenue", vector: "verbs_up", subject: "the net revenue of the firm" },
  { title: "Quarterly Expenditure", yAxis: "Expenses", vector: "verbs_down", subject: "expenditures" },
  { title: "Steel Production", yAxis: "Volume", vector: "verbs_flat", subject: "the production of steel" },
  { title: "Weekly Cargo Shipping Weight", yAxis: "Mass", vector: "verbs_up", subject: "commercial cargo weight" },
  { title: "Software Licenses", yAxis: "Volume", vector: "verbs_up", subject: "software licenses" },
  { title: "Grain Storage", yAxis: "Weight", vector: "verbs_down", subject: "grain storage" },
  { title: "Crude Petroleum Barrels", yAxis: "Volume", vector: "verbs_flat", subject: "crude petroleum barrels" },
  { title: "Vehicle Units", yAxis: "Output", vector: "verbs_up", subject: "vehicle units" },
  { title: "International Coffee Bean Production", yAxis: "Weight", vector: "verbs_down", subject: "international bulk coffee bean production" },
  { title: "Regional Transactions", yAxis: "Operations", vector: "verbs_flat", subject: "regional transactions" },
  { title: "Vaccine Shipments", yAxis: "Volume", vector: "verbs_up", subject: "vaccine shipments" },
  { title: "E-Commerce Product Deliveries", yAxis: "Packages", vector: "verbs_up", subject: "e-commerce package deliveries" },
  { title: "Industrial Aluminum Production", yAxis: "Weight", vector: "verbs_down", subject: "industrial aluminum production" },
  { title: "Hydropower Output", yAxis: "Volume", vector: "verbs_flat", subject: "hydropower output" },
  { title: "Consumer Electronics Distribution", yAxis: "Value", vector: "verbs_up", subject: "consumer electronics distribution" },
  { title: "Cotton Consumption", yAxis: "Weight", vector: "verbs_down", subject: "cotton consumption" },
  { title: "Urban Recycling Volume", yAxis: "Mass", vector: "verbs_flat", subject: "urban recycling volume" },
  { title: "AI Tokens", yAxis: "Hardware", vector: "verbs_up", subject: "AI tokens" },
  { title: "Aviation Liquid Kerosene Imports", yAxis: "Volume", vector: "verbs_down", subject: "aviation liquid kerosene imports" },
  { title: "Global Microchip Orders", yAxis: "Silicon", vector: "verbs_flat", subject: "global microchip orders" },
  { title: "Hospital Bed Occupancy", yAxis: "Patients", vector: "verbs_up", subject: "hospital bed occupancy rates" },
  { title: "Daily Water Consumption", yAxis: "Liters", vector: "verbs_down", subject: "municipal water consumption" },
  { title: "Solar Panel Output", yAxis: "Energy", vector: "verbs_up", subject: "solar panel electricity generation" },
  { title: "Library Book Checkouts", yAxis: "Loans", vector: "verbs_flat", subject: "public library book checkouts" },
  { title: "Forest Timber Harvest", yAxis: "Volume", vector: "verbs_down", subject: "timber harvested from forests" },
  { title: "University Enrollment", yAxis: "Students", vector: "verbs_up", subject: "university enrollment numbers" },
  { title: "Pharmaceutical Trials", yAxis: "Cases", vector: "verbs_flat", subject: "pharmaceutical trial participation" },
  { title: "Retail Foot Traffic", yAxis: "Visitors", vector: "verbs_up", subject: "retail store foot traffic" },
  { title: "Greenhouse Gas Emissions", yAxis: "CO₂e", vector: "verbs_down", subject: "greenhouse gas emissions" },
  { title: "Wind Turbine Output", yAxis: "Energy", vector: "verbs_flat", subject: "wind turbine energy output" },
  { title: "Public Transit Ridership", yAxis: "Passengers", vector: "verbs_up", subject: "public transit ridership" },
  { title: "Food Bank Donations", yAxis: "Weight", vector: "verbs_up", subject: "food bank donation volume" },
  { title: "Construction Permits", yAxis: "Permits", vector: "verbs_flat", subject: "construction permits issued" },
  { title: "Hotel Occupancy", yAxis: "Rooms", vector: "verbs_down", subject: "hotel room occupancy" },
  { title: "Course Enrollments", yAxis: "Students", vector: "verbs_up", subject: "course enrollments" },
  { title: "Battery Storage Capacity", yAxis: "kWh", vector: "verbs_up", subject: "grid battery storage capacity" },
  { title: "Fishing Catch Volume", yAxis: "Weight", vector: "verbs_down", subject: "commercial fishing catch volume" },
  { title: "Museum Attendance", yAxis: "Visitors", vector: "verbs_flat", subject: "museum visitor attendance" },
  { title: "Organic Cheese Sales", yAxis: "Value", vector: "verbs_up", subject: "sales of organic cheese" },
  { title: "Satellite Launches", yAxis: "Launches", vector: "verbs_up", subject: "satellite launch counts" }
];
