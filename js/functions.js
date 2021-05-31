/*
PROJECT 01
INFO-3144-02-20F Applied JavaScript Tools and Frameworks
Pamela Pires Dos Santos - p_piresdossantosdoo
Thalis Vicente Santos - t_vicentesantos

*/

// -------------------------- STEP 01 ---------------------------------------

// create globals  to store row and column
var selectedRow;
var selectedColumn;

var tableArray = [];

var rows = 20;
var columns = 10;

// loop for store the rows and column position in the table Array

for (var i = 0; i < rows; i++) {
    tableArray[i] = [];
    for (var j = 0; j < columns; j++){
        tableArray[i][j] = "";
    }
}

// FUNCTION BUILDTABLE - Works as a table constructor based on the pre defined number of rows and columns
function buildTable(rows, columns) {

    // start with the table declaration
    var divTable = "<table border='1' cellpadding='0' cellspacing='0' class='TableClass'>";

    // next do the column header labels
    divTable += "<tr><th></th>";

    for (var j = 0; j < columns; j++)
        divTable += "<th>" + String.fromCharCode(j + 65) + "</th>";

    // closing row tag for the headers
    divTable += "</tr>";

    // now do the main table area
    for (var i = 1; i <= rows; i++) {

        //first column of the current row (row label)
        divTable += "<td id='" + i + "_0' class='BaseColumn'>" + i + "</td>";

        // the rest of columns - Note the event handler 'onClick' to assign the especific cell information to a function
        for (var j = 1; j <= columns; j++)
            divTable += "<td id='" + i + "_" + j + "' class='tableArea' onclick='clickCell(this)'></td>";

        // end of the row
        divTable += "</tr>";
    }

    // finally add the end of table tag
    divTable += "</table>";

    // Once the table TAGs is built, the 
    return divTable;
}

// ONLOAD EVENT
function createSpreadSheet() {
    //The table will render on the user screen
    document.getElementById("spreadSheetTable").innerHTML = buildTable(rows, columns);
}

// --------------------------- STEP 02 --------------------------------------

//Requirement: Cell mouse selection similar to Excel Sheet

function clickCell(ref) {
    cellSelected(ref.id);
    document.getElementById('input-formula').setAttribute('data-id-cell', ref.id);
    document.getElementById('input-formula').removeAttribute('disabled');
    
    //The cell element ID 'i _ j' will be splited inside rcArray into slot 0 and 1 respectively, and then assigned to variables responsable for hold row and colunm current information 
    var rcArray = ref.id.split('_');
    selectedRow = rcArray[0];
    selectedColumn = rcArray[1];
    
    //Insert the 'Matrix' value to a user test input, so the user will be able to make any changes in the selected table 
    document.getElementById('input-formula').value = tableArray[selectedRow - 1][selectedColumn - 1];
    //Method focus() will highlight the user text input 
    document.getElementById('input-formula').focus();
}

function cellSelected (selected) {
	// variable cell is going to get and hold the current Input Attribute ID  from the input
	var cell = document.getElementById('input-formula').getAttribute('data-id-cell');	
	if (cell) {
		//once the variable 'cell' is true, this condition is going to remove the Class attribute (which are dealing with cell style), consequently turning the background to white
		var selBefore = document.getElementById(cell);	
		selBefore.classList.remove('cSelected');
	}
	// Based on the new cell clicked parameter, the function will address the ID to a Class attribute  'cSelected' in order to handle with selected cell style
	var cSelected = document.getElementById(selected);
	cSelected.classList.add('cSelected');
}

function inputValue() {
    //Input value will be assign to a variable number
    var number = document.getElementById("input-formula").value;
    number = number.toUpperCase();

    if (window.event.keyCode === 13) {
        //Insert input value into the 2D Array
        document.getElementById(`${selectedRow}_${selectedColumn}`).innerHTML = number;
        // add the index into array
        tableArray[selectedRow - 1][selectedColumn - 1] = number;
        // call function to calculate the formula
        calculateCell(selectedRow - 1, selectedColumn - 1);
        recalculate();
    }
}

// ------------------------- STEP 03 -------------------------------------

// determines if user entered a formula such as =SUM(A1:B2)
// returns an array with formula components

function getFormula(tableValue) {
    var pattern = /[:|\(|\)]/;
    var ar = tableValue.split(pattern);
    var sum = ar[0].toUpperCase();
    //Checking is the user input is a formula
    if (ar.length < 3) // It means that the input is not a formula =SUM(Ax:By), which has 3 pattern's characters
        return null;
    else if (sum !== "=SUM") //If true, it means that should be considering as a regurar input text and return null
        return null;
    else
        return ar; //['=SUM', 'Ax', 'By']
}

// function to check if the number is float value
function isFloat(s) {
    var ch = "";
    var justFloat = "0123456789.";

    if (s.length == 0) { return false } 
    for (var i = 0; i < s.length; i++) {
        ch = s.substr(i, 1);

        if (justFloat.indexOf(ch) == -1) { return false }
    }
    return true;
}

// function calculate the SUM FORMULA
function calculateCell(row, column) {

    // begin by getting the formula parts
    var tokenArray = getFormula(tableArray[row][column]);

    // tokenArray[1] and tokenArray[2] contain the from and to references
    // need more validation if this was a production level app

    if (tokenArray !== null) {
        // Created variables from / to in order to set the calculation range throughout Row and Colunms
        var fromColumn = tokenArray[1].substr(0, 1);
        var fromRow = tokenArray[1].substr(1, tokenArray[1].length - 1);
        var toColumn = tokenArray[2].substr(0, 1);
        var toRow = tokenArray[2].substr(1, tokenArray[2].length - 1);

        // assign the actual row/column index values for the tableArray
        var fromRowIndex = parseFloat(fromRow) - 1;
        var fromColIndex = fromColumn.charCodeAt(0) - 65;

        var toRowIndex = parseFloat(toRow) - 1;
        var toColIndex = toColumn.charCodeAt(0) - 65;

        var sumTotal = 0;

        for (var i = fromRowIndex; i <= toRowIndex; i++) {
            for (var j = fromColIndex; j <= toColIndex; j++) {
                // make sure we have a number for addition
                if (tableArray[i][j].startsWith("=SUM")) {
                    var cellValue = document.getElementById(Number(i + 1) + "_" + Number(j + 1));
                    sumTotal += parseFloat(cellValue.textContent);
                }
                if (isFloat(tableArray[i][j]))
                    sumTotal += parseFloat(tableArray[i][j]);
            }
        }

        // we now have the total... insert into spreadsheet cell
        // ... get the cell id
        var cellID = (row + 1) + "_" + (column + 1);
        document.getElementById(cellID).innerHTML = sumTotal;
    }
}

//recalculate values considering the hole rows and columns previously assigned as a global variables 
function recalculate() {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < columns; j++) {
            // check to see if table element is a formula
            if (tableArray[i][j].indexOf("=SUM") !== -1) {
                // apply the formula for cell at row/column i/j
                calculateCell(i, j);
            }
        }
    }
}

// function to clean all values from the table
function clearAll() {

    document.getElementById("spreadSheetTable").innerHTML = "";
    document.getElementById("input-formula").value = "";
    tableArray = [];

    // loop for store the rows and column position in the table Array
    for (var i = 0; i < rows; i++) {
        tableArray[i] = [];

        for (var j = 0; j < columns; j++)
            tableArray[i][j] = "";
    }

    //once every data was cleaned, call the table constructor again
    createSpreadSheet();
}

