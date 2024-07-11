document.addEventListener('DOMContentLoaded', function () {
  const inputs = Array.from(document.querySelectorAll('input[type="number"]'));
  const usasInputs = Array.from(document.querySelectorAll('.chart-inputs input[type="number"]'));
  const variableInputs = Array.from(document.querySelectorAll('.variables input[type="number"]'));

  // Initialize chart
  const ctx = document.getElementById('myChart').getContext('2d');
  const myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['1r USAS', '2º USAS', '3r USAS', '4º USAS', '5º USAS', '6º USAS'],
      datasets: [{
        label: 'Symptoms USAS',
        data: [0, 0, 0, 0, 0, 0],
        backgroundColor: 'rgba(75, 192, 192, 1)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2
      }]
    },
    options: {
      scales: {
        x: {
          barPercentage: 0.8,
          categoryPercentage: 0.8,
          offset: true,
          grid: {
            display: false
          }
        },
        y: {
          beginAtZero: true,
          suggestedMin: 0,
          suggestedMax: 10
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: false
        }
      },
      responsive: true,
      maintainAspectRatio: false,
    }
  });

  const updateChart = () => {
    myChart.data.datasets[0].data = usasInputs.map(i => parseFloat(i.value));
    myChart.update();
  };

  const validateInputs = () => {
    const inputsContainingNotValidValues = inputs.map(i => parseFloat(i.value))
      .reduce((invalidIndices, value, index) => {
        if (isNaN(value) || value < 0 || value > 10) {
          invalidIndices.push(index);
        }
        return invalidIndices;
      }, []);

    const errorTooltip = document.querySelector('.error-tooltip');
    const resultSection = document.getElementById('result-section');

    inputs.forEach(i => i.classList.remove('invalid'));

    if (inputsContainingNotValidValues.length === 0) {
      errorTooltip.classList.add('important-hidden');
      resultSection.classList.remove('important-hidden');
      return true;
    }
    errorTooltip.classList.remove('important-hidden');
    resultSection.classList.add('important-hidden');
    inputsContainingNotValidValues.forEach(index => inputs[index].classList.add('invalid'));
    return false;
  };

  const getEvaluationResult = () => {
    const usasValues = usasInputs.map(i => parseFloat(i.value));
    const [emotionThreshold, peekToLastThreshold] = variableInputs.map(i => parseFloat(i.value));

    document.querySelectorAll('.emotion-threshold-value').forEach(i => i.value = emotionThreshold);
    document.querySelectorAll('.peek-to-last-threshold-value').forEach(i => i.value = peekToLastThreshold);

    const lastUsas = usasValues[usasValues.length - 1];
    document.querySelectorAll('.last-usas-value').forEach(i => i.value = lastUsas);
    if (lastUsas < emotionThreshold) return 'successful';

    const peek = Math.max(...usasValues);
    document.querySelectorAll('.peek-usas-value').forEach(i => i.value = peek);
    const peekToLast = peek - lastUsas;
    if (peekToLast >= peekToLastThreshold) return 'neutral';

    return 'failed';
  };

  const showResult = resultToShow => {
    document.querySelectorAll('.successful, .neutral, .failed').forEach(i => {
      i.hidden = true;
    });

    if (resultToShow === 'successful') {
      document.querySelectorAll('.successful').forEach(i => i.hidden = false);
    } else if (resultToShow === 'neutral') {
      document.querySelectorAll('.neutral').forEach(i => i.hidden = false);
    } else if (resultToShow === 'failed') {
      document.querySelectorAll('.failed').forEach(i => i.hidden = false);
    }
  };

  const updateResult = () => {
    if (!validateInputs()) return;
    const evaluationResult = getEvaluationResult();
    showResult(evaluationResult);
  };

  updateResult();

  inputs.forEach(input => {
    input.addEventListener('input', function () {
      updateChart();
      updateResult();
    });
  });
});
