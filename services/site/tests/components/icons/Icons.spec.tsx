import A11yphantLogo from "app/components/icons/A11yphantLogo";
import Check from "app/components/icons/Check";
import Chevron from "app/components/icons/Chevron";
import Github from "app/components/icons/Github";
import Heart from "app/components/icons/Heart";
import IllustrationCodingMan from "app/components/icons/IllustrationCodingMan";
import IllustrationCodingWoman from "app/components/icons/IllustrationCodingWoman";
import IllustrationCouchWoman from "app/components/icons/IllustrationCouchWoman";
import IllustrationFloatingWoman from "app/components/icons/IllustrationFloatingWomen";
import IllustrationLost from "app/components/icons/IllustrationLost";
import IllustrationLostSpace from "app/components/icons/IllustrationLostSpace";
import IllustrationPhoneWoman from "app/components/icons/IllustrationPhoneWoman";
import IllustrationRocket from "app/components/icons/IllustrationRocket";
import LoadingIndicator from "app/components/icons/LoadingIndicator";
import Reset from "app/components/icons/Reset";
import Slash from "app/components/icons/Slash";
import Twitter from "app/components/icons/Twitter";
import UserAvatar from "app/components/icons/UserAvatar";
import X from "app/components/icons/X";

describe.each([
  ["Logo", A11yphantLogo],
  ["Check", Check],
  ["Chevron", Chevron],
  ["GitHub", Github],
  ["IllustrationCodingWoman", IllustrationCodingWoman],
  ["IllustrationRocket", IllustrationRocket],
  ["IllustrationFloatingWoman", IllustrationFloatingWoman],
  ["IllustrationCouchWoman", IllustrationCouchWoman],
  ["IllustrationPhoneWoman", IllustrationPhoneWoman],
  ["IllustrationCodingMan", IllustrationCodingMan],
  ["IllustrationLost", IllustrationLost],
  ["IllustrationLostSpace", IllustrationLostSpace],
  ["Reset", Reset],
  ["Slash", Slash],
  ["Twitter", Twitter],
  ["UserAvatar", UserAvatar],
  ["X", X],
  ["LoadingIndicator", LoadingIndicator],
  ["Heart", Heart],
])("Icons", (_, Component) => {
  test("the %s icon renders without failure", () => {
    expect(() => Component({})).not.toThrow();
  });
});
