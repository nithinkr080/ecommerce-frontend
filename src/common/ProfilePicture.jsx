const ProfilePicture = ({ name }) => {
  const hRange = [0, 360];
  const sRange = [0, 100];
  const lRange = [0, 100];

  const getHashOfString = (str) => {
    let hash = 0;
    for (let i = 0; i < str?.length; i++) {
      hash = str?.charCodeAt(i) + ((hash << 5) - hash);
    }
    hash = Math.abs(hash);
    return hash;
  };

  const normalizeHash = (hash, min, max) => {
    return Math.floor((hash % (max - min)) + min);
  };

  const HSLtoString = (hsl) => {
    return `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`;
  };

  const generateHSL = () => {
    const hash = getHashOfString(name);
    const h = normalizeHash(hash, hRange[0], hRange[1]);
    const s = normalizeHash(hash, sRange[0], sRange[1]);
    const l = normalizeHash(hash, lRange[0], lRange[1]);
    return HSLtoString([h, s, l]);
  };
  return (
    <>
      <div
        style={{
          color: "white",
          backgroundColor: generateHSL("eijdndn"),
          width: "25px",
          height: "25px",
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {name[0]}
      </div>
    </>
  );
};

export default ProfilePicture;
