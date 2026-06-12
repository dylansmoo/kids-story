import { useState } from "react";
import { Avatar } from "../Avatar";
import {
  ages,
  genders,
  hairColors,
  hairStyles,
  newKidProfile,
  skinTones,
  type KidProfile,
} from "../profile";

interface ProfileEditorProps {
  initial: KidProfile | null;
  canDelete: boolean;
  onSave: (profile: KidProfile) => void;
  onDelete: (kidId: string) => void;
  onCancel: () => void;
}

function ProfileEditor({ initial, canDelete, onSave, onDelete, onCancel }: ProfileEditorProps) {
  const [profile, setProfile] = useState<KidProfile>(initial ?? newKidProfile());
  const isNew = initial === null;

  const set = <K extends keyof KidProfile>(field: K, value: KidProfile[K]) =>
    setProfile((current) => ({ ...current, [field]: value }));

  return (
    <div className="editor">
      <div className="reader-bar">
        <button type="button" className="link-button" onClick={onCancel}>
          &larr; Back
        </button>
        <span className="reader-title">{isNew ? "Add your child" : `Edit ${profile.name || "profile"}`}</span>
        <span className="page-count" />
      </div>

      <div className="editor-card">
        <div className="editor-preview">
          <Avatar profile={profile} size={132} />
          <p className="editor-preview-name">{profile.name.trim() || "Your little hero"}</p>
        </div>

        <div className="editor-fields">
          <label htmlFor="kid-name">First name</label>
          <input
            id="kid-name"
            className="hero-input"
            value={profile.name}
            onChange={(event) => set("name", event.target.value)}
            placeholder="First name"
            maxLength={20}
            autoComplete="off"
          />

          <span className="picker-label">Boy or girl</span>
          <div className="chip-row">
            {genders.map((gender) => (
              <button
                key={gender.id}
                type="button"
                className={profile.gender === gender.id ? "chip selected" : "chip"}
                onClick={() => set("gender", profile.gender === gender.id ? "" : gender.id)}
                aria-pressed={profile.gender === gender.id}
              >
                {gender.label}
              </button>
            ))}
          </div>

          <span className="picker-label">Age</span>
          <div className="chip-row">
            {ages.map((age) => (
              <button
                key={age}
                type="button"
                className={profile.age === age ? "chip selected" : "chip"}
                onClick={() => set("age", age)}
                aria-pressed={profile.age === age}
              >
                {age}
              </button>
            ))}
          </div>

          <span className="picker-label">Skin tone</span>
          <div className="chip-row">
            {skinTones.map((tone) => (
              <button
                key={tone.id}
                type="button"
                className={profile.skinTone === tone.id ? "swatch selected" : "swatch"}
                style={{ background: tone.color }}
                onClick={() => set("skinTone", tone.id)}
                aria-label={tone.label}
                aria-pressed={profile.skinTone === tone.id}
              />
            ))}
          </div>

          <span className="picker-label">Hair colour</span>
          <div className="chip-row">
            {hairColors.map((color) => (
              <button
                key={color.id}
                type="button"
                className={profile.hairColor === color.id ? "swatch selected" : "swatch"}
                style={{ background: color.color }}
                onClick={() => set("hairColor", color.id)}
                aria-label={color.label}
                aria-pressed={profile.hairColor === color.id}
              />
            ))}
          </div>

          <span className="picker-label">Hair style</span>
          <div className="chip-row">
            {hairStyles.map((style) => (
              <button
                key={style.id}
                type="button"
                className={profile.hairStyle === style.id ? "style-pick selected" : "style-pick"}
                onClick={() => set("hairStyle", style.id)}
                aria-pressed={profile.hairStyle === style.id}
              >
                <Avatar profile={{ ...profile, hairStyle: style.id }} size={56} />
                <span>{style.label}</span>
              </button>
            ))}
          </div>

          <span className="picker-label">Glasses</span>
          <div className="chip-row">
            <button
              type="button"
              className={!profile.glasses ? "chip selected" : "chip"}
              onClick={() => set("glasses", false)}
              aria-pressed={!profile.glasses}
            >
              No glasses
            </button>
            <button
              type="button"
              className={profile.glasses ? "chip selected" : "chip"}
              onClick={() => set("glasses", true)}
              aria-pressed={profile.glasses}
            >
              Glasses
            </button>
          </div>
        </div>
      </div>

      <div className="editor-actions">
        {canDelete && !isNew && (
          <button type="button" className="nav-button danger" onClick={() => onDelete(profile.id)}>
            Remove
          </button>
        )}
        <button
          type="button"
          className="nav-button primary"
          onClick={() => onSave(profile)}
          disabled={profile.name.trim().length === 0}
        >
          {isNew ? "Add child" : "Save"}
        </button>
      </div>
    </div>
  );
}

export default ProfileEditor;
