import { artStyles } from "../profile";

interface StylePickerProps {
  value: string;
  onChange: (styleId: string) => void;
}

/** Art style chooser with real generated sample images. */
function StylePicker({ value, onChange }: StylePickerProps) {
  return (
    <div className="style-grid">
      {artStyles.map((style) => (
        <button
          key={style.id}
          type="button"
          className={value === style.id ? "style-tile selected" : "style-tile"}
          onClick={() => onChange(style.id)}
          aria-pressed={value === style.id}
        >
          <img src={style.thumb} alt={`${style.label} style sample`} loading="lazy" />
          <span className="style-tile-label">{style.label}</span>
          <span className="style-tile-desc">{style.desc}</span>
        </button>
      ))}
    </div>
  );
}

export default StylePicker;
