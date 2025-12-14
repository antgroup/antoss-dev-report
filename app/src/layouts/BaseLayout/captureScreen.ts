import html2canvas from 'html2canvas';

const captureScreen = async (element: HTMLElement) => {
  const canvas = await html2canvas(element, {
    useCORS: true,
    backgroundColor: 'transparent',
  });
  const url = canvas.toDataURL('image/png');

  return {
    canvas,
    url,
  };
};

export default captureScreen;
