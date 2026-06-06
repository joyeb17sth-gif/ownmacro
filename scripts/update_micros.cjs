const fs = require('fs');

const additions = {
  'starter-chicken-breast': { vitaminA: 6, vitaminC: 0, vitaminD: 0.1, vitaminB12: 0.3, calcium: 11, iron: 0.7, potassium: 256, sodium: 74, zinc: 0.8, magnesium: 29 },
  'starter-chicken-thigh': { vitaminA: 24, vitaminC: 0, vitaminD: 0.1, vitaminB12: 0.4, calcium: 11, iron: 1, potassium: 228, sodium: 85, zinc: 1.6, magnesium: 23 },
  'starter-whole-egg': { vitaminA: 80, vitaminC: 0, vitaminD: 1.1, vitaminB12: 0.6, calcium: 28, iron: 0.9, potassium: 69, sodium: 71, zinc: 0.6, magnesium: 6 },
  'starter-egg-white': { vitaminA: 0, vitaminC: 0, vitaminD: 0, vitaminB12: 0, calcium: 2, iron: 0, potassium: 54, sodium: 55, zinc: 0, magnesium: 4 },
  'starter-salmon': { vitaminA: 40, vitaminC: 0, vitaminD: 11.1, vitaminB12: 3.2, calcium: 12, iron: 0.8, potassium: 363, sodium: 44, zinc: 0.4, magnesium: 27 },
  'starter-tuna': { vitaminA: 15, vitaminC: 0, vitaminD: 1.1, vitaminB12: 2.5, calcium: 11, iron: 1.5, potassium: 237, sodium: 247, zinc: 0.7, magnesium: 27 },
  'starter-shrimp': { vitaminA: 54, vitaminC: 0, vitaminD: 3.8, vitaminB12: 1.2, calcium: 52, iron: 0.5, potassium: 259, sodium: 111, zinc: 1.1, magnesium: 33 },
  'starter-beef-lean': { vitaminA: 0, vitaminC: 0, vitaminD: 0.1, vitaminB12: 2.6, calcium: 18, iron: 2.6, potassium: 318, sodium: 66, zinc: 6.3, magnesium: 21 },
  'starter-tofu': { vitaminA: 0, vitaminC: 0.1, vitaminD: 0, vitaminB12: 0, calcium: 350, iron: 5.4, potassium: 121, sodium: 7, zinc: 1.6, magnesium: 30 },
  'starter-buff-minced': { vitaminA: 0, vitaminC: 0, vitaminD: 0, vitaminB12: 2, calcium: 15, iron: 2.5, potassium: 300, sodium: 70, zinc: 5, magnesium: 20 },
  'starter-white-rice': { vitaminA: 0, vitaminC: 0, vitaminD: 0, vitaminB12: 0, calcium: 10, iron: 1.2, potassium: 35, sodium: 1, zinc: 0.4, magnesium: 12 },
  'starter-boiled-potato': { vitaminA: 0, vitaminC: 13, vitaminD: 0, vitaminB12: 0, calcium: 5, iron: 0.3, potassium: 328, sodium: 5, zinc: 0.3, magnesium: 20 },
  'starter-brown-bread': { vitaminA: 0, vitaminC: 0, vitaminD: 0, vitaminB12: 0, calcium: 30, iron: 0.8, potassium: 70, sodium: 150, zinc: 0.6, magnesium: 20 },
  'starter-white-bread': { vitaminA: 0, vitaminC: 0, vitaminD: 0, vitaminB12: 0, calcium: 40, iron: 1, potassium: 30, sodium: 130, zinc: 0.2, magnesium: 6 },
  'starter-multigrain-bread': { vitaminA: 0, vitaminC: 0, vitaminD: 0, vitaminB12: 0, calcium: 35, iron: 0.9, potassium: 80, sodium: 140, zinc: 0.7, magnesium: 25 },
  'starter-butter': { vitaminA: 6.8, vitaminC: 0, vitaminD: 0, vitaminB12: 0, calcium: 0.2, iron: 0, potassium: 0.2, sodium: 6, zinc: 0, magnesium: 0 },
  'starter-olive-oil': { vitaminA: 0, vitaminC: 0, vitaminD: 0, vitaminB12: 0, calcium: 0, iron: 0, potassium: 0, sodium: 0, zinc: 0, magnesium: 0 },
  'starter-mustard-oil': { vitaminA: 0, vitaminC: 0, vitaminD: 0, vitaminB12: 0, calcium: 0, iron: 0, potassium: 0, sodium: 0, zinc: 0, magnesium: 0 },
  'starter-curd': { vitaminA: 20, vitaminC: 0.5, vitaminD: 0.1, vitaminB12: 0.4, calcium: 120, iron: 0.1, potassium: 150, sodium: 40, zinc: 0.6, magnesium: 12 },
  'starter-broccoli': { vitaminA: 31, vitaminC: 89, vitaminD: 0, vitaminB12: 0, calcium: 47, iron: 0.7, potassium: 316, sodium: 33, zinc: 0.4, magnesium: 21 },
  'starter-cucumber': { vitaminA: 5, vitaminC: 2.8, vitaminD: 0, vitaminB12: 0, calcium: 16, iron: 0.3, potassium: 147, sodium: 2, zinc: 0.2, magnesium: 13 },
  'starter-carrot': { vitaminA: 835, vitaminC: 5.9, vitaminD: 0, vitaminB12: 0, calcium: 33, iron: 0.3, potassium: 320, sodium: 69, zinc: 0.2, magnesium: 12 },
  'starter-onion': { vitaminA: 0, vitaminC: 7.4, vitaminD: 0, vitaminB12: 0, calcium: 23, iron: 0.2, potassium: 146, sodium: 4, zinc: 0.2, magnesium: 10 },
  'starter-garlic': { vitaminA: 0, vitaminC: 3.1, vitaminD: 0, vitaminB12: 0, calcium: 18, iron: 0.2, potassium: 40, sodium: 2, zinc: 0.1, magnesium: 2 },
  'starter-ginger': { vitaminA: 0, vitaminC: 0.5, vitaminD: 0, vitaminB12: 0, calcium: 1.6, iron: 0.1, potassium: 41, sodium: 1, zinc: 0, magnesium: 4 },
  'starter-apple': { vitaminA: 3, vitaminC: 4.6, vitaminD: 0, vitaminB12: 0, calcium: 6, iron: 0.1, potassium: 107, sodium: 1, zinc: 0, magnesium: 5 },
  'starter-chickpeas-sprout': { vitaminA: 2, vitaminC: 11, vitaminD: 0, vitaminB12: 0, calcium: 49, iron: 2.9, potassium: 291, sodium: 24, zinc: 1.5, magnesium: 48 },
  'starter-watermelon': { vitaminA: 28, vitaminC: 8.1, vitaminD: 0, vitaminB12: 0, calcium: 7, iron: 0.2, potassium: 112, sodium: 1, zinc: 0.1, magnesium: 10 },
  'starter-avocado': { vitaminA: 7, vitaminC: 10, vitaminD: 0, vitaminB12: 0, calcium: 12, iron: 0.5, potassium: 485, sodium: 7, zinc: 0.6, magnesium: 29 },
  'starter-paneer': { vitaminA: 200, vitaminC: 0, vitaminD: 0.5, vitaminB12: 0.8, calcium: 480, iron: 0.5, potassium: 100, sodium: 20, zinc: 2, magnesium: 20 },
  'starter-soya-chunks-boiled': { vitaminA: 0, vitaminC: 0, vitaminD: 0, vitaminB12: 0, calcium: 90, iron: 4.5, potassium: 500, sodium: 5, zinc: 1.5, magnesium: 85 }
};

let content = fs.readFileSync('src/utils/constants.js', 'utf8');

// Parse the content block manually
const lines = content.split('\n');
const newLines = [];
let inStarterFoods = false;

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  
  if (line.includes('export const STARTER_FOODS = [')) {
    inStarterFoods = true;
    newLines.push(line);
    continue;
  }
  
  if (inStarterFoods && line.trim() === '];') {
    inStarterFoods = false;
    newLines.push(line);
    continue;
  }
  
  if (inStarterFoods) {
    if (line.includes('id:')) {
      const match = line.match(/id:\s*'([^']+)'/);
      if (match) {
        const id = match[1];
        newLines.push(line);
        // next line is servingSize etc
        i++;
        newLines.push(lines[i]);
        
        // skip existing micros if any
        while(lines[i+1] && lines[i+1].includes('vitaminA')) {
          i++;
        }
        
        if (additions[id]) {
          let microStr = '    ';
          for (const [k, v] of Object.entries(additions[id])) {
            microStr += `${k}: ${v}, `;
          }
          newLines.push(microStr.trimEnd());
        }
      } else {
        newLines.push(line);
      }
    } else {
      // push standard lines that are not part of an id block (e.g. { or })
      if (!line.includes('vitaminA')) {
        newLines.push(line);
      }
    }
  } else {
    newLines.push(line);
  }
}

const output = newLines.join('\n');
if (content !== output) {
  fs.writeFileSync('src/utils/constants.js', output);
  console.log('SUCCESS');
} else {
  console.log('FAILED');
}
