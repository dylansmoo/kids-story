import type { jsPDF } from "jspdf";
import { heroName } from "./HeroText";
import { personalize, type Story } from "./stories";

const PAGE_W = 595;
const PAGE_H = 842;

const toDataUrl = async (src: string): Promise<string | null> => {
  if (src.startsWith("data:")) return src;
  try {
    const response = await fetch(src);
    const blob = await response.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
};

const paintBackground = (doc: jsPDF) => {
  doc.setFillColor(250, 247, 242);
  doc.rect(0, 0, PAGE_W, PAGE_H, "F");
};

/** Builds and downloads the story as a personalized PDF book. */
export const downloadStoryPdf = async (story: Story, name: string): Promise<void> => {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const display = heroName(name);
  const title = personalize(story.title, name);

  // Cover
  paintBackground(doc);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(34);
  doc.setTextColor(47, 58, 79);
  doc.text(doc.splitTextToSize(title, 440), PAGE_W / 2, 330, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(15);
  doc.setTextColor(95, 107, 130);
  doc.text(`A Little Hero Story starring ${display}`, PAGE_W / 2, 410, { align: "center" });

  for (let index = 0; index < story.pages.length; index += 1) {
    const page = story.pages[index];
    doc.addPage();
    paintBackground(doc);

    let textTop = 180;
    if (page.image) {
      const dataUrl = await toDataUrl(page.image);
      if (dataUrl) {
        const format = dataUrl.startsWith("data:image/png") ? "PNG" : "JPEG";
        const size = 360;
        doc.addImage(dataUrl, format, (PAGE_W - size) / 2, 80, size, size);
        textTop = 500;
      }
    }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.setTextColor(47, 58, 79);
    const lines = doc.splitTextToSize(personalize(page.text, name), 440);
    doc.text(lines, PAGE_W / 2, textTop, { align: "center", lineHeightFactor: 1.6 });

    if (story.readTogether !== false) {
      doc.setFontSize(12);
      doc.setTextColor(217, 83, 46);
      doc.text(
        `Say it together: "${personalize(page.readAloud, name)}"`,
        PAGE_W / 2,
        textTop + lines.length * 26 + 30,
        { align: "center" },
      );
    }

    doc.setFontSize(11);
    doc.setTextColor(139, 150, 171);
    doc.text(String(index + 1), PAGE_W / 2, PAGE_H - 40, { align: "center" });
  }

  doc.save(`${title.replace(/[^\w\s'-]/g, "").trim() || "story"}.pdf`);
};
