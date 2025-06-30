import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";

// 👇 This should be run after user signs up and UPI is collected
const storeVendorData = async (upiId: string) => {
  const user = auth.currentUser;

  if (!user) {
    console.warn("No user found.");
    return;
  }

  try {
    await setDoc(doc(db, "vendors", user.uid), {
      uid: user.uid,
      email: user.email,
      upiId: upiId,
      createdAt: new Date(),
    });
    console.log("✅ Vendor data saved!");
  } catch (error) {
    console.error("❌ Error storing vendor data:", error);
  }
};
