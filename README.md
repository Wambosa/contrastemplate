# juxtaposition
The problem of comparing and evaluating several products/solutions/houses has caused me to write this tool.

Shows a comparison using a simple stacked bar chart driven by a **data source**

The more metrics (requirements) that are used, the more effective this tool becomes.

## The Data Source
The data source is currently a humble JSON file

#### Category
Categories are required and represent the highest level of comparison.
Each category can be given an optional weight to increase or reduce the emphasis.
- the default weight is 1
- **name** is required and is **case sensitive**
```javascript
"categories": [
    {"name": "Cost", "weight": 3},
    {"name": "Community", "weight": 1.5},
    {"name": "Ammenities", "weight": 1.0}
]
```

#### Requirement
Requirements attached to a single category only to later be summed up and averaged out with other related requirements.
- **category** is required and case sensitive. (in order to match with the aforementioned high level categories)
- **name** is required
- **notes** is optional and is used as documentation on the page
- **weight** is optional and defaults to 1
```javascript
"requirements": [
    {
      "category": "Cost",
      "name": "upfront",
      "notes": ["less than $150,000"]
    },
    {
      "category": "Community",
      "name": "School Disctrict",
      "notes": ["10 rating?", "average student GPA?", "PTA involement ratio?"]
    }
]
```

#### Solutions
A solution is one of the things being compared. It holds _grades_ on each requirement.
Enabling all possible solutions to be equally compared on the same scale.
- **name** is the display name of the solution
- **grades** is a key-value pair (dictionary) where the _key_ is the **exact** case sensitive _requirement name_
- the grade value needs to be between 0 and 1.0 (so a 70% grade would be written as 0.7)
- omitting a requirement or mis typing the requirement name will cause that grade to be 0
- entering numbers higher than 1 become 1
- entering numbers lower than 0 become 0
```javascript
"solutions": [
    {
        "name": "Bluffs 123 main st",
        "grades": {
            "upfront": 0.5,
            "closing fee": 1.0
        }
    },
    {
        "name": "other house",
        "grades": {
            "upfront": 1,
            "closing fee": 0,
            "HOA free zone": 0,
            "School District": 1,
            "Crime Rate": 0.5,
            "Pool": 0.5
        }
    }
]
```


#### Full Example
``` javascript
{
    "problemStatement": "myTitle (not required)",
    
    "categories": [
        {"name": "Cost", "weight": 3},
        {"name": "Community", "weight": 1.5},
        {"name": "Ammenities", "weight": 1.0}
    ],
    
    "requirements": [
        {
          "category": "Cost",
          "name": "upfront",
          "notes": ["less than $150,000"]
        },
        {
          "category": "Cost",
          "name": "closing fee",
          "notes": ["is there a closing fee at all? (bad)"]
        },
        {
          "category": "Cost",
          "name": "HOA free zone",
          "notes": ["stupid HOA! (grade zero if exists)"]
        },  
        {
          "category": "Community",
          "name": "School Disctrict",
          "notes": ["10 rating?", "average student GPA?", "PTA involement ratio?"]
        },
        {
          "category": "Community",
          "name": "Crime Rate",
          "notes": ["more than 0 violent crimes in the last month?", "more than 0 crimes in the last year"]
        },
        {
          "category": "Ammenities",
          "name": "Pool",
          "notes": ["is there a pool at all?", "is it deeper than 4 ft?"]
        }
    ],
    
    "solutions": [
        {
            "name": "Bluffs 123 main st",
            "grades": {
                "upfront": 0.5,
                "closing fee": 1.0,
                "HOA free zone": 0,
                "School District": 0.65,
                "Crime Rate": 1.0,
                "Pool": 0
            }
        },
        {
            "name": "other house",
            "grades": {
                "upfront": 1,
                "closing fee": 0,
                "HOA free zone": 0,
                "School District": 1,
                "Crime Rate": 0.5,
                "Pool": 0.5
            }
        }
    ],
    
    "categoryWeightSlider": {
        "ticks": [1, 1.5, 2, 2.5, 3],
        "ticks_positions": [0, 25, 50, 75, 100],
        "ticks_labels": ["normal", "important", "very important", "critical", "very critical"],
        "ticks_snap_bounds": 0.1,
        "step": 0.01
    }
}
```
