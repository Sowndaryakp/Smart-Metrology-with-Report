import DxfParser from 'dxf-parser';

// Assuming you have the DXF file content as a string
const dxfContent = 'p167.dxf'; // Replace with your actual DXF content

const parser = new DxfParser();
const doc = parser.parseSync(dxfContent);

doc.entities.forEach((entity) => {
  const entity_type = entity.type;

  if (entity_type === 'DIMENSION') {
    console.log(`Dimension Entity: ${JSON.stringify(entity)}`);

    // Check for extended data or custom properties containing style information
    const extendedData = entity.extendedData;
    const toleranceValues = extractToleranceValues(extendedData);

    console.log(`Tolerance values - Upper: ${toleranceValues.plusTolerance || 'N/A'}, Lower: ${toleranceValues.minusTolerance || 'N/A'}`);
  }
});

// Custom function to extract tolerance values from extended data
function extractToleranceValues(extendedData) {
  if (!extendedData || !Array.isArray(extendedData)) {
    return {};
  }

  const result = {};
  for (const data of extendedData) {
    if (data.applicationName === 'ACAD' && data.customStrings && data.customStrings.length === 2) {
      // Check for specific codes related to tolerance values
      result.plusTolerance = data.customStrings[0];
      result.minusTolerance = data.customStrings[1];
      break; // Exit the loop after finding the relevant data
    }
  }

  return result;
}
