// Import the 'fs' (File System) module, which is built into Node.js.
const fs = require('fs');

// Define the names of both JSON files.
const fileName1 = 'testcase1.json';
const fileName2 = 'testcase2.json';

// --- General Functions for the Assignment ---

const getPoints = (data, k) => {
    const points = [];
    for (let i = 1; i <= k; i++) {
        const pointData = data[i.toString()]; 
        const base = parseInt(pointData.base);
        const x = parseInt(pointData.value, base);
        const y = base; 
        points.push({ x, y });
    }
    return points;
};

const determinant3x3 = (matrix) => {
    const [a, b, c] = matrix[0];
    const [d, e, f] = matrix[1];
    const [g, h, i] = matrix[2];
    return a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
};

const solveQuadraticC = (points) => {
    if (points.length < 3) {
        return 'Not enough points to solve for C (requires 3 points).';
    }

    const [x1, y1] = [points[0].x, points[0].y];
    const [x2, y2] = [points[1].x, points[1].y];
    const [x3, y3] = [points[2].x, points[2].y];

    const D_matrix = [
        [x1 * x1, x1, 1],
        [x2 * x2, x2, 1],
        [x3 * x3, x3, 1]
    ];
    
    const Dc_matrix = [
        [x1 * x1, x1, y1],
        [x2 * x2, x2, y2],
        [x3 * x3, x3, y3]
    ];
    
    const detD = determinant3x3(D_matrix);
    const detDc = determinant3x3(Dc_matrix);

    if (detD === 0) {
        return 'Determinant of D is zero. No unique solution.';
    }

    return detDc / detD;
};

// --- Main Execution Logic ---

// Get the user's choice from command-line arguments.
// `process.argv[2]` holds the first argument after 'node' and 'script_name'.
const userChoice = process.argv[2];

const runTest = (fileName, isCorrectCase) => {
    try {
        const jsonData = fs.readFileSync(fileName, 'utf8');
        const data = JSON.parse(jsonData);
        const kFromFile = data.keys.k;
        const kToUse = isCorrectCase ? kFromFile : 3;

        console.log(`--- Test Case: ${fileName} ---`);
        console.log(`Polynomial degree m=${kToUse - 1}, requiring k=${kToUse} points.`);
        
        const points = getPoints(data, kToUse);
        console.log("\nParsed points:");
        console.log(points);
        
        const C = solveQuadraticC(points);
        console.log(`\nValue of C is: ${C}`);

    } catch (error) {
        console.error(`Error with Test Case ${fileName}: ${error.message}`);
    }
};

if (userChoice === '1') {
    runTest(fileName1, true); // Run test case 1, using its correct k value
} else if (userChoice === '2') {
    runTest(fileName2, false); // Run test case 2, with the 'wrong' k=3
} else {
    // If no argument is provided, run both by default.
    runTest(fileName1, true);
    console.log('\n' + '='.repeat(50) + '\n');
    runTest(fileName2, false);
}