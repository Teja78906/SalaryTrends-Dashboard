// Function to handle the CSV file input
function handleFiles(files) {
    const file = files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const text = event.target.result;
        const parsedData = parseCSV(text);
        const aggregatedData = aggregateData(parsedData);
        renderTable(aggregatedData);
    };

    reader.readAsText(file);
}

// Parse CSV Data into an array of objects
function parseCSV(data) {
    const lines = data.trim().split('\n');
    const headers = lines[0].split(',');
    return lines.slice(1).map(line => {
        const values = line.split(',');
        return headers.reduce((obj, header, index) => {
            obj[header] = values[index];
            return obj;
        }, {});
    });
}

// Modify data to get jobs per year and average salary
function aggregateData(parsedData) {
    const yearData = {};
    parsedData.forEach(row => {
        const year = row.work_year;
        const salary = parseInt(row.salary_in_usd, 10);

        if (!yearData[year]) {
            yearData[year] = { totalJobs: 0, totalSalary: 0 };
        }

        yearData[year].totalJobs += 1;
        yearData[year].totalSalary += salary;
    });

    // Calculate average salary for each year
    return Object.entries(yearData).map(([year, data]) => ({
        year: year,
        totalJobs: data.totalJobs,
        averageSalary: (data.totalSalary / data.totalJobs).toFixed(2)
    }));
}

// Render table based on aggregated data
function renderTable(data) {
    const tableBody = document.querySelector('#salaryTable tbody');
    tableBody.innerHTML = ''; 

    data.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.year}</td>
            <td>${row.totalJobs}</td>
            <td>${row.averageSalary}</td>
        `;
        tableBody.appendChild(tr);
    });
}

// Sort table data
function sortTable(columnIndex) {
    const table = document.querySelector("#salaryTable");
    const tbody = table.tBodies[0];
    const rows = Array.from(tbody.rows);

    // check if column sorted ascending or descending
    const isAscending = table.dataset.sortDirection === "asc";

    // Sort rows based on the selected column
    rows.sort((rowA, rowB) => {
        const cellA = rowA.cells[columnIndex].textContent;
        const cellB = rowB.cells[columnIndex].textContent;

        return isAscending
            ? cellA.localeCompare(cellB, undefined, { numeric: true })
            : cellB.localeCompare(cellA, undefined, { numeric: true });
    });

    
    rows.forEach(row => tbody.appendChild(row));

    
    table.dataset.sortDirection = isAscending ? "desc" : "asc";
}
