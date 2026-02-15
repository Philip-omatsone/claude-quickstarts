interface ExtractedMetric {
  label: string;
  value: number;
  type: string;
}

export async function extractTextFromPdf(file: File): Promise<string> {
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ');
    fullText += pageText + '\n\n';
  }

  return fullText;
}

export function extractMetricsFromText(text: string): ExtractedMetric[] {
  const metrics: ExtractedMetric[] = [];

  const patterns: { regex: RegExp; type: string; label: string }[] = [
    { regex: /(?:total\s+)?revenue[:\s]+\$?([\d,.]+)\s*(million|billion|mn|bn)?/gi, type: 'revenue', label: 'Revenue' },
    { regex: /net\s+income[:\s]+\$?([\d,.]+)\s*(million|billion|mn|bn)?/gi, type: 'net_income', label: 'Net Income' },
    { regex: /operating\s+income[:\s]+\$?([\d,.]+)\s*(million|billion|mn|bn)?/gi, type: 'operating_income', label: 'Operating Income' },
    { regex: /bad\s+debt\s+ratio[:\s]+([\d.]+)%?/gi, type: 'bad_debt_ratio', label: 'Bad Debt Ratio' },
    { regex: /provision\s+coverage[:\s]+([\d.]+)%?/gi, type: 'provision_coverage', label: 'Provision Coverage' },
    { regex: /(?:npl|non[- ]performing\s+loan)\s+ratio[:\s]+([\d.]+)%?/gi, type: 'npl_ratio', label: 'NPL Ratio' },
    { regex: /total\s+assets[:\s]+\$?([\d,.]+)\s*(million|billion|mn|bn)?/gi, type: 'total_assets', label: 'Total Assets' },
  ];

  for (const { regex, type, label } of patterns) {
    let match;
    while ((match = regex.exec(text)) !== null) {
      let value = parseFloat(match[1].replace(/,/g, ''));
      const multiplier = match[2]?.toLowerCase();
      if (multiplier === 'billion' || multiplier === 'bn') value *= 1_000_000_000;
      else if (multiplier === 'million' || multiplier === 'mn') value *= 1_000_000;

      metrics.push({ label, value, type });
    }
  }

  return metrics;
}
