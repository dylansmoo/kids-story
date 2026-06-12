import { hairColorOf, skinColorOf, type KidProfile } from "./profile";

interface AvatarProps {
  profile: Pick<KidProfile, "skinTone" | "hairColor" | "hairStyle" | "glasses">;
  size?: number;
}

/** A friendly cartoon avatar drawn from the profile's appearance picks. */
export function Avatar({ profile, size = 72 }: AvatarProps) {
  const skin = skinColorOf(profile as KidProfile);
  const hair = hairColorOf(profile as KidProfile);
  const style = profile.hairStyle;

  return (
    <svg
      className="avatar"
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label="Child avatar"
    >
      {/* hair behind the face */}
      {style === "long" && (
        <>
          <rect x="13" y="40" width="16" height="44" rx="8" fill={hair} />
          <rect x="71" y="40" width="16" height="44" rx="8" fill={hair} />
        </>
      )}
      {style === "pigtails" && (
        <>
          <circle cx="13" cy="56" r="11" fill={hair} />
          <circle cx="87" cy="56" r="11" fill={hair} />
        </>
      )}
      {style === "curly" ? (
        <>
          <circle cx="28" cy="40" r="14" fill={hair} />
          <circle cx="39" cy="30" r="14" fill={hair} />
          <circle cx="53" cy="27" r="14" fill={hair} />
          <circle cx="66" cy="31" r="14" fill={hair} />
          <circle cx="74" cy="42" r="13" fill={hair} />
        </>
      ) : (
        <circle cx="50" cy="46" r="31" fill={hair} />
      )}

      {/* face */}
      <circle cx="50" cy="58" r="28" fill={skin} />

      {/* eyes and smile */}
      <circle cx="40" cy="56" r="2.8" fill="#2d2218" />
      <circle cx="60" cy="56" r="2.8" fill="#2d2218" />
      <path
        d="M 42 68 Q 50 75 58 68"
        fill="none"
        stroke="#2d2218"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* blush */}
      <circle cx="33" cy="64" r="4.5" fill="#f5a08c" opacity="0.5" />
      <circle cx="67" cy="64" r="4.5" fill="#f5a08c" opacity="0.5" />

      {/* glasses */}
      {profile.glasses && (
        <g stroke="#2d2218" strokeWidth="2.4" fill="none">
          <circle cx="40" cy="56" r="8.5" />
          <circle cx="60" cy="56" r="8.5" />
          <line x1="48.5" y1="56" x2="51.5" y2="56" />
        </g>
      )}
    </svg>
  );
}
