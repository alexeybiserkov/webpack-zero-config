const tacoCompactCompChart = {
  init() {
    const compCharts = document.querySelectorAll('.taco-compact-comp-chart');

    compCharts.forEach((compChart) => {
      this.removeUnnecessaryColumnSwitchOptions(compChart);
      this.switchColumns(compChart);
    });
  },

  getColumnsData(compChart) {
    const columns = compChart.querySelectorAll('.column');
    const columnsData = {};

    columns.forEach((column) => {
      const columnIndex = column.getAttribute('data-column-index');
      const columnBuilder = column.getAttribute('data-column-builder');

      columnsData[columnIndex] = {
        id: columnIndex,
        builder: columnBuilder,
        isVisible: window.getComputedStyle(column).display === 'block',
      };
    });

    return columnsData;
  },

  // Display only switchable columns in dropdown on: 'load' and 'change'
  removeUnnecessaryColumnSwitchOptions(compChart) {
    const columnsData = this.getColumnsData(compChart);
    const dropdowns = compChart.querySelectorAll('.column-switch-dropdown');

    dropdowns.forEach((dropdown) => {
      const options = dropdown.querySelectorAll('option');

      options.forEach((option) => {
        if (!option.selected) {
          option.remove();
        }
      });

      for (const key in columnsData) {
        const columnData = columnsData[key];

        if (!columnData.isVisible) {
          dropdown.insertAdjacentHTML('beforeend', `<option value="${columnData.id}">${columnData.builder}</option>`);
        }
      }
    });
  },

  // Switch columns
  switchColumns(compChart) {
    const columnSwitchDropdowns = compChart.querySelectorAll('.column-switch-dropdown');

    columnSwitchDropdowns.forEach((columnSwitchDropdown) => {
      columnSwitchDropdown.addEventListener('change', (e) => {
        e.preventDefault();

        const dropdown = e.currentTarget;
        const compChartWrapper = dropdown.closest('.chart-wrapper');

        const targetColumn = dropdown.closest('.column');
        const targetColumnIndex = targetColumn.getAttribute('data-column-index');

        const selectedColumnIndex = dropdown.value;
        const selectedColumn = compChart.querySelector(`[data-column-index="${selectedColumnIndex}"]`);

        // Swap the columns
        targetColumn.insertAdjacentElement('beforebegin', selectedColumn);
        compChartWrapper.appendChild(targetColumn);

        // Reset the dropdown value so it reflect the builder title for its column
        dropdown.value = targetColumnIndex;

        // Reset the dropdown options
        this.removeUnnecessaryColumnSwitchOptions(compChart);
      });
    });
  },
};

tacoCompactCompChart.init();
