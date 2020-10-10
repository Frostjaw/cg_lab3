// Class for l-systems
class lSystem {}

// Class for states
class State 
{
    constructor(x, y, angle)
    {
        this.x = x;
        this.y = y;
        this.angle = angle;
    }
}

// Initialize l-systems

// Koch snowflake
var kochSnowflake = new lSystem();
kochSnowflake.axiom = 'F++F++F';
kochSnowflake.genRules = 
[
    ['F', 'F-F++F-F']
];
kochSnowflake.angle = 60;

// Dragon curve
var dragonCurve = new lSystem();
dragonCurve.axiom = 'FX';
dragonCurve.genRules = 
[
    ['F', 'F'],
    ['X', 'X+YF+'],
    ['Y', '-FX-Y']
];
dragonCurve.angle = 90;

// Sierpinski triangle
var sierpinskiTriangle = new lSystem();
sierpinskiTriangle.axiom = 'FXF--FF--FF';
sierpinskiTriangle.genRules = 
[
    ['F', 'FF'],
    ['X', '--FXF++FXF++FXF--']
];
sierpinskiTriangle.angle = 60;

// Hilbert curve
var hilbertCurve = new lSystem();
hilbertCurve.axiom = 'X';
hilbertCurve.genRules = 
[
    ['F', 'F'],
    ['X', '-YF+XFX+FY-'],
    ['Y', '+XF-YFY-FX+']
];
hilbertCurve.angle = 90;

// Tree 1
var tree1 = new lSystem();
tree1.axiom = 'F';
tree1.genRules = 
[
    ['F', 'F[+F]F[-F]F']
];
tree1.angle = 25.7;

// Tree 2
var tree2 = new lSystem();
tree2.axiom = 'F';
tree2.genRules = 
[
    ['F', 'F[+F]F[-F][F]']
];
tree2.angle = 20;

// Tree 3
var tree3 = new lSystem();
tree3.axiom = 'X';
tree3.genRules = 
[
    ['F', 'F'],
    ['X', 'F[+X][-X]FX']
];
tree3.angle = 25.7;

// Tree 4
var tree4 = new lSystem();
tree4.axiom = 'F';
tree4.genRules = 
[
    ['F', '-F[-F+F-F]+[+F-F-F]']
];
tree4.angle = 20;


// General default settings
var stepSize = 10; // in px
var recursionDepth = 2;


function launchPage()
{
    let drawButton = document.getElementById('drawButton');
    drawButton.addEventListener("click", drawCurrentFractal);

    let stepSizeInput = document.getElementById('stepSizeInput');
    stepSizeInput.addEventListener("keyup", function(event) {
        if (event.key === "Enter") {
            stepSize = stepSizeInput.value;
        }
    });
}

function drawCurrentFractal() {

    // Get step size from input
    let stepSizeInput = document.getElementById('stepSizeInput');
    if (stepSizeInput.value) 
    {
        stepSize = stepSizeInput.value;
    }

    // Get recursion depth from input
    let recursionDepthInput = document.getElementById('recursionDepthInput');
    if (recursionDepthInput.value) 
    {
        recursionDepth = recursionDepthInput.value;
    }

    let currentFractal = getCurrentFractal();

    let tempString = currentFractal.axiom;
    for (let i = 0; i < recursionDepth; i++) 
    {
        tempString = getNewString(currentFractal, tempString);
    }

    draw(currentFractal, tempString);
}

function getCurrentFractal()
{
    let currentFractalSelect = document.getElementById("fractalTypeSelect");
    let nameOfCurrentFractal = currentFractalSelect.options[currentFractalSelect.selectedIndex].value;
    switch(nameOfCurrentFractal)
    {
        case 'kochSnowflake':
            currentFractal = kochSnowflake;
            break;
        case 'dragonCurve':
            currentFractal = dragonCurve;
            break;
        case 'sierpinskiTriangle':
            currentFractal = sierpinskiTriangle;
            break;
        case 'hilbertCurve':
            currentFractal = hilbertCurve;
            break;
        case 'tree1':
            currentFractal = tree1;
            break;
        case 'tree2':
            currentFractal = tree2;
            break;
        case 'tree3':
            currentFractal = tree3;
            break;
        case 'tree4':
            currentFractal = tree4;
            break;
    }
    
    return currentFractal;
}

function getNewString(currentFractal, string)
{
    let newString = '';
    for (let i = 0; i < string.length; i++)
    {
        let isMatched = false;
        for (let j = 0; j < currentFractal.genRules.length; j++)
        {
            if (string[i] == currentFractal.genRules[j][0])
            {
                newString += currentFractal.genRules[j][1];
                isMatched = true;
                break;
            }
        }
        if (isMatched == false) newString += string[i];
    }
    return newString;
}

function degreesToRadians(degrees)
{
  return degrees * (Math.PI / 180);
}

function draw(currentFractal, string)
{
    var canvas = document.getElementById('canvas');
    if (canvas.getContext) {
        var context = canvas.getContext('2d');

        context.clearRect(0, 0, canvas.width, canvas.height);
        
        let startX = canvas.width / 2;
        let startY = canvas.height / 2;

        let curX = startX;
        let curY = startY;

        let stack = [];

        let currentAngle = 0;
        context.beginPath();

        for (let i = 0; i < string.length; i++)
        {
            switch(string[i])
            {
                case 'F':
                    context.moveTo(curX, curY);
                    curX = curX + stepSize * Math.cos(degreesToRadians(currentAngle));
                    curY = curY + stepSize * Math.sin(degreesToRadians(currentAngle));
                    context.lineTo(curX, curY);
                    break;

                case '+':
                    currentAngle += currentFractal.angle;
                    break;

                case '-':
                    currentAngle -= currentFractal.angle;
                    break;
                case '[':
                    stack.push(new State(curX, curY, currentAngle));
                    break;
                case ']':
                    let lastState = stack.pop();
                    curX = lastState.x;
                    curY = lastState.y;
                    currentAngle = lastState.angle;
                    break;
            }
        }

        context.stroke();
        //context.fill();
    }
}
