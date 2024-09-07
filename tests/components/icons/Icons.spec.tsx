import A11yphantLogo from "app/components/icons/A11yphantLogo";
import Check from "app/components/icons/Check";
import Chevron from "app/components/icons/Chevron";
import Education from "app/components/icons/Education";
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
import Money from "app/components/icons/Money";
import Monitor from "app/components/icons/Monitor";
import NewTab from "app/components/icons/NewTab";
import Reset from "app/components/icons/Reset";
import Slash from "app/components/icons/Slash";
import Twitter from "app/components/icons/Twitter";
import UserAvatar from "app/components/icons/UserAvatar";
import ClosingX from "app/components/icons/ClosingX";

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
  ["X", ClosingX],
  ["LoadingIndicator", LoadingIndicator],
  ["Heart", Heart],
  ["Monitor", Monitor],
  ["Money", Money],
  ["Education", Education],
  ["NewTab", NewTab],
])("Icons", (_, Component) => {
  test("the %s icon renders without failure", () => {
    expect(() => Component({})).not.toThrow();
  });
});
