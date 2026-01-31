import { useState } from "react";
import { useTranslation } from "react-i18next";
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";

const COUNTRY_CODES = [
  { code: "+93", countryCode: "AFG", flag: "🇦🇫" },
  { code: "+355", countryCode: "ALB", flag: "🇦🇱" },
  { code: "+213", countryCode: "DZA", flag: "🇩🇿" },
  { code: "+376", countryCode: "AND", flag: "🇦🇩" },
  { code: "+244", countryCode: "AGO", flag: "🇦🇴" },
  { code: "+54", countryCode: "ARG", flag: "🇦🇷" },
  { code: "+374", countryCode: "ARM", flag: "🇦🇲" },
  { code: "+61", countryCode: "AUS", flag: "🇦🇺" },
  { code: "+43", countryCode: "AUT", flag: "🇦🇹" },
  { code: "+994", countryCode: "AZE", flag: "🇦🇿" },
  { code: "+973", countryCode: "BHR", flag: "🇧🇭" },
  { code: "+880", countryCode: "BGD", flag: "🇧🇩" },
  { code: "+375", countryCode: "BLR", flag: "🇧🇾" },
  { code: "+32", countryCode: "BEL", flag: "🇧🇪" },
  { code: "+501", countryCode: "BLZ", flag: "🇧🇿" },
  { code: "+229", countryCode: "BEN", flag: "🇧🇯" },
  { code: "+975", countryCode: "BTN", flag: "🇧🇹" },
  { code: "+591", countryCode: "BOL", flag: "🇧🇴" },
  { code: "+387", countryCode: "BIH", flag: "🇧🇦" },
  { code: "+267", countryCode: "BWA", flag: "🇧🇼" },
  { code: "+55", countryCode: "BRA", flag: "🇧🇷" },
  { code: "+673", countryCode: "BRN", flag: "🇧🇳" },
  { code: "+359", countryCode: "BGR", flag: "🇧🇬" },
  { code: "+226", countryCode: "BFA", flag: "🇧🇫" },
  { code: "+257", countryCode: "BDI", flag: "🇧🇮" },
  { code: "+855", countryCode: "KHM", flag: "🇰🇭" },
  { code: "+237", countryCode: "CMR", flag: "🇨🇲" },
  { code: "+1", countryCode: "CAN", flag: "🇨🇦" },
  { code: "+238", countryCode: "CPV", flag: "🇨🇻" },
  { code: "+236", countryCode: "CAF", flag: "🇨🇫" },
  { code: "+235", countryCode: "TCD", flag: "🇹🇩" },
  { code: "+56", countryCode: "CHL", flag: "🇨🇱" },
  { code: "+86", countryCode: "CHN", flag: "🇨🇳" },
  { code: "+57", countryCode: "COL", flag: "🇨🇴" },
  { code: "+269", countryCode: "COM", flag: "🇰🇲" },
  { code: "+242", countryCode: "COG", flag: "🇨🇬" },
  { code: "+243", countryCode: "COD", flag: "🇨🇩" },
  { code: "+506", countryCode: "CRI", flag: "🇨🇷" },
  { code: "+225", countryCode: "CIV", flag: "🇨🇮" },
  { code: "+385", countryCode: "HRV", flag: "🇭🇷" },
  { code: "+53", countryCode: "CUB", flag: "🇨🇺" },
  { code: "+357", countryCode: "CYP", flag: "🇨🇾" },
  { code: "+420", countryCode: "CZE", flag: "🇨🇿" },
  { code: "+45", countryCode: "DNK", flag: "🇩🇰" },
  { code: "+253", countryCode: "DJI", flag: "🇩🇯" },
  { code: "+593", countryCode: "ECU", flag: "🇪🇨" },
  { code: "+20", countryCode: "EGY", flag: "🇪🇬" },
  { code: "+503", countryCode: "SLV", flag: "🇸🇻" },
  { code: "+240", countryCode: "GNQ", flag: "🇬🇶" },
  { code: "+291", countryCode: "ERI", flag: "🇪🇷" },
  { code: "+372", countryCode: "EST", flag: "🇪🇪" },
  { code: "+251", countryCode: "ETH", flag: "🇪🇹" },
  { code: "+679", countryCode: "FJI", flag: "🇫🇯" },
  { code: "+358", countryCode: "FIN", flag: "🇫🇮" },
  { code: "+33", countryCode: "FRA", flag: "🇫🇷" },
  { code: "+241", countryCode: "GAB", flag: "🇬🇦" },
  { code: "+220", countryCode: "GMB", flag: "🇬🇲" },
  { code: "+995", countryCode: "GEO", flag: "🇬🇪" },
  { code: "+49", countryCode: "DEU", flag: "🇩🇪" },
  { code: "+233", countryCode: "GHA", flag: "🇬🇭" },
  { code: "+30", countryCode: "GRC", flag: "🇬🇷" },
  { code: "+502", countryCode: "GTM", flag: "🇬🇹" },
  { code: "+224", countryCode: "GIN", flag: "🇬🇳" },
  { code: "+245", countryCode: "GNB", flag: "🇬🇼" },
  { code: "+592", countryCode: "GUY", flag: "🇬🇾" },
  { code: "+509", countryCode: "HTI", flag: "🇭🇹" },
  { code: "+504", countryCode: "HND", flag: "🇭🇳" },
  { code: "+852", countryCode: "HKG", flag: "🇭🇰" },
  { code: "+36", countryCode: "HUN", flag: "🇭🇺" },
  { code: "+354", countryCode: "ISL", flag: "🇮🇸" },
  { code: "+91", countryCode: "IND", flag: "🇮🇳" },
  { code: "+62", countryCode: "IDN", flag: "🇮🇩" },
  { code: "+98", countryCode: "IRN", flag: "🇮🇷" },
  { code: "+964", countryCode: "IRQ", flag: "🇮🇶" },
  { code: "+353", countryCode: "IRL", flag: "🇮🇪" },
  { code: "+972", countryCode: "ISR", flag: "🇮🇱" },
  { code: "+39", countryCode: "ITA", flag: "🇮🇹" },
  { code: "+81", countryCode: "JPN", flag: "🇯🇵" },
  { code: "+962", countryCode: "JOR", flag: "🇯🇴" },
  { code: "+7", countryCode: "KAZ", flag: "🇰🇿" },
  { code: "+254", countryCode: "KEN", flag: "🇰🇪" },
  { code: "+965", countryCode: "KWT", flag: "🇰🇼" },
  { code: "+996", countryCode: "KGZ", flag: "🇰🇬" },
  { code: "+856", countryCode: "LAO", flag: "🇱🇦" },
  { code: "+371", countryCode: "LVA", flag: "🇱🇻" },
  { code: "+961", countryCode: "LBN", flag: "🇱🇧" },
  { code: "+266", countryCode: "LSO", flag: "🇱🇸" },
  { code: "+231", countryCode: "LBR", flag: "🇱🇷" },
  { code: "+218", countryCode: "LBY", flag: "🇱🇾" },
  { code: "+423", countryCode: "LIE", flag: "🇱🇮" },
  { code: "+370", countryCode: "LTU", flag: "🇱🇹" },
  { code: "+352", countryCode: "LUX", flag: "🇱🇺" },
  { code: "+853", countryCode: "MAC", flag: "🇲🇴" },
  { code: "+389", countryCode: "MKD", flag: "🇲🇰" },
  { code: "+261", countryCode: "MDG", flag: "🇲🇬" },
  { code: "+265", countryCode: "MWI", flag: "🇲🇼" },
  { code: "+60", countryCode: "MYS", flag: "🇲🇾" },
  { code: "+960", countryCode: "MDV", flag: "🇲🇻" },
  { code: "+223", countryCode: "MLI", flag: "🇲🇱" },
  { code: "+356", countryCode: "MLT", flag: "🇲🇹" },
  { code: "+222", countryCode: "MRT", flag: "🇲🇷" },
  { code: "+230", countryCode: "MUS", flag: "🇲🇺" },
  { code: "+52", countryCode: "MEX", flag: "🇲🇽" },
  { code: "+373", countryCode: "MDA", flag: "🇲🇩" },
  { code: "+377", countryCode: "MCO", flag: "🇲🇨" },
  { code: "+976", countryCode: "MNG", flag: "🇲🇳" },
  { code: "+382", countryCode: "MNE", flag: "🇲🇪" },
  { code: "+212", countryCode: "MAR", flag: "🇲🇦" },
  { code: "+258", countryCode: "MOZ", flag: "🇲🇿" },
  { code: "+95", countryCode: "MMR", flag: "🇲🇲" },
  { code: "+264", countryCode: "NAM", flag: "🇳🇦" },
  { code: "+977", countryCode: "NPL", flag: "🇳🇵" },
  { code: "+31", countryCode: "NLD", flag: "🇳🇱" },
  { code: "+64", countryCode: "NZL", flag: "🇳🇿" },
  { code: "+505", countryCode: "NIC", flag: "🇳🇮" },
  { code: "+227", countryCode: "NER", flag: "🇳🇪" },
  { code: "+234", countryCode: "NGA", flag: "🇳🇬" },
  { code: "+850", countryCode: "PRK", flag: "🇰🇵" },
  { code: "+47", countryCode: "NOR", flag: "🇳🇴" },
  { code: "+968", countryCode: "OMN", flag: "🇴🇲" },
  { code: "+92", countryCode: "PAK", flag: "🇵🇰" },
  { code: "+507", countryCode: "PAN", flag: "🇵🇦" },
  { code: "+675", countryCode: "PNG", flag: "🇵🇬" },
  { code: "+595", countryCode: "PRY", flag: "🇵🇾" },
  { code: "+51", countryCode: "PER", flag: "🇵🇪" },
  { code: "+63", countryCode: "PHL", flag: "🇵🇭" },
  { code: "+48", countryCode: "POL", flag: "🇵🇱" },
  { code: "+351", countryCode: "PRT", flag: "🇵🇹" },
  { code: "+974", countryCode: "QAT", flag: "🇶🇦" },
  { code: "+40", countryCode: "ROU", flag: "🇷🇴" },
  { code: "+7", countryCode: "RUS", flag: "🇷🇺" },
  { code: "+250", countryCode: "RWA", flag: "🇷🇼" },
  { code: "+966", countryCode: "SAU", flag: "🇸🇦" },
  { code: "+221", countryCode: "SEN", flag: "🇸🇳" },
  { code: "+381", countryCode: "SRB", flag: "🇷🇸" },
  { code: "+248", countryCode: "SYC", flag: "🇸🇨" },
  { code: "+232", countryCode: "SLE", flag: "🇸🇱" },
  { code: "+65", countryCode: "SGP", flag: "🇸🇬" },
  { code: "+421", countryCode: "SVK", flag: "🇸🇰" },
  { code: "+386", countryCode: "SVN", flag: "🇸🇮" },
  { code: "+252", countryCode: "SOM", flag: "🇸🇴" },
  { code: "+27", countryCode: "ZAF", flag: "🇿🇦" },
  { code: "+82", countryCode: "KOR", flag: "🇰🇷" },
  { code: "+211", countryCode: "SSD", flag: "🇸🇸" },
  { code: "+34", countryCode: "ESP", flag: "🇪🇸" },
  { code: "+94", countryCode: "LKA", flag: "🇱🇰" },
  { code: "+249", countryCode: "SDN", flag: "🇸🇩" },
  { code: "+597", countryCode: "SUR", flag: "🇸🇷" },
  { code: "+46", countryCode: "SWE", flag: "🇸🇪" },
  { code: "+41", countryCode: "CHE", flag: "🇨🇭" },
  { code: "+963", countryCode: "SYR", flag: "🇸🇾" },
  { code: "+886", countryCode: "TWN", flag: "🇹🇼" },
  { code: "+992", countryCode: "TJK", flag: "🇹🇯" },
  { code: "+255", countryCode: "TZA", flag: "🇹🇿" },
  { code: "+66", countryCode: "THA", flag: "🇹🇭" },
  { code: "+228", countryCode: "TGO", flag: "🇹🇬" },
  { code: "+216", countryCode: "TUN", flag: "🇹🇳" },
  { code: "+90", countryCode: "TUR", flag: "🇹🇷" },
  { code: "+993", countryCode: "TKM", flag: "🇹🇲" },
  { code: "+256", countryCode: "UGA", flag: "🇺🇬" },
  { code: "+380", countryCode: "UKR", flag: "🇺🇦" },
  { code: "+971", countryCode: "ARE", flag: "🇦🇪" },
  { code: "+44", countryCode: "GBR", flag: "🇬🇧" },
  { code: "+1", countryCode: "USA", flag: "🇺🇸" },
  { code: "+598", countryCode: "URY", flag: "🇺🇾" },
  { code: "+998", countryCode: "UZB", flag: "🇺🇿" },
  { code: "+678", countryCode: "VUT", flag: "🇻🇺" },
  { code: "+58", countryCode: "VEN", flag: "🇻🇪" },
  { code: "+84", countryCode: "VNM", flag: "🇻🇳" },
  { code: "+967", countryCode: "YEM", flag: "🇾🇪" },
  { code: "+260", countryCode: "ZMB", flag: "🇿🇲" },
  { code: "+263", countryCode: "ZWE", flag: "🇿🇼" },
];

export default function ContactMe() {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', null
  const [phoneCountryCode, setPhoneCountryCode] = useState("+33");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    const form = e.target;
    const formData = new FormData(form);
    
    // Ajouter le numéro de téléphone complet
    const fullPhoneNumber = `${phoneCountryCode}${phoneNumber}`;
    formData.set("phone-number", fullPhoneNumber);

    // Préparer les données pour Firestore
    const contactData = {
      firstName: formData.get("first-name"),
      lastName: formData.get("last-name"),
      email: formData.get("email"),
      phoneNumber: fullPhoneNumber,
      subject: formData.get("choose-subject"),
      message: formData.get("message"),
      createdAt: new Date().toISOString()
    };

    try {
      // Sauvegarder dans Firestore
      await addDoc(collection(db, "contacts"), contactData);
      
      // Optionnel: Envoyer aussi à getform.io si tu veux garder les emails
      const response = await fetch("https://getform.io/f/bxoovyoa", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setSubmitStatus("success");
        form.reset();
        setPhoneCountryCode("+33");
        setPhoneNumber("");
        setTimeout(() => setSubmitStatus(null), 5000);
      } else {
        // Même si getform échoue, les données sont dans Firebase
        setSubmitStatus("success");
        form.reset();
        setPhoneCountryCode("+33");
        setPhoneNumber("");
        setTimeout(() => setSubmitStatus(null), 5000);
      }
    } catch (error) {
      console.error("Erreur:", error);
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="Contact" className="contact--section">
      <div>
        <p className="sub-title"></p>
        <h2>{t('contact.title')}</h2>
        <p className="text-lg">{t('contact.description')}</p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="contact--form--container"
      >
        <div className="container">
          <label htmlFor="first-name" className="contact--label required">
            <span className="text-md">{t('contact.form.firstName')} <span className="required-asterisk">*</span></span>
            <input
              type="text"
              className="contact--input text-md"
              name="first-name"
              id="first-name"
              placeholder={t('contact.form.firstName')}
              required
            />
          </label>
          <label htmlFor="last-name" className="contact--label required">
            <span className="text-md">{t('contact.form.lastName')} <span className="required-asterisk">*</span></span>
            <input
              type="text"
              className="contact--input text-md"
              name="last-name"
              id="last-name"
              placeholder={t('contact.form.lastName')}
              required
            />
          </label>
          <label htmlFor="email" className="contact--label required">
            <span className="text-md">{t('contact.form.email')} <span className="required-asterisk">*</span></span>
            <input
              type="email"
              className="contact--input text-md"
              name="email"
              id="email"
              placeholder={t('contact.form.email')}
              required
            />
          </label>
          <label htmlFor="phone-number" className="contact--label required">
            <span className="text-md">{t('contact.form.phone')} <span className="required-asterisk">*</span></span>
            <div className="phone--input--container">
              <select
                className="contact--input contact--input--country text-md"
                value={phoneCountryCode}
                onChange={(e) => setPhoneCountryCode(e.target.value)}
                required
              >
                {COUNTRY_CODES.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.flag} {item.code}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                className="contact--input contact--input--number text-md"
                name="phone-number"
                id="phone-number"
                placeholder={t('contact.form.phone')}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                required
              />
            </div>
          </label>
        </div>
        <label htmlFor="choose-topic" className="contact--label required">
          <span className="text-md">{t('contact.form.message')} <span className="required-asterisk">*</span></span>
          <select
            id="choose-topic"
            name="topic"
            className="contact--input text-md"
            required
          >
            <option value="">{t('contact.form.selectTopic')}</option>
            <option value="Freelance">{t('contact.form.freelance')}</option>
            <option value="Collaboration">{t('contact.form.collaboration')}</option>
            <option value="Autres">{t('contact.form.other')}</option>
          </select>
        </label>
        <label htmlFor="message" className="contact--label required">
          <span className="text-md">{t('contact.form.message')} <span className="required-asterisk">*</span></span>
          <textarea
            className="contact--input text-md"
            id="message"
            name="message"
            rows="8"
            placeholder={t('contact.form.message')}
            required
          />
        </label>
        <label htmlFor="checkbox" className="checkbox--label required">
          <input type="checkbox" required name="checkbox" id="checkbox" />
          <span className="text-sm">{t('contact.form.agreeTerms')} <span className="required-asterisk">*</span></span>
        </label>
        <div>
          <button 
            type="submit" 
            className="btn btn-primary contact--form--btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? t('contact.form.submitting') : t('contact.form.submit')}
          </button>
          {submitStatus === "success" && (
            <p className="form--message form--message--success">
              ✓ {t('contact.form.success')}
            </p>
          )}
          {submitStatus === "error" && (
            <p className="form--message form--message--error">
              ✗ {t('contact.form.error')}
            </p>
          )}
        </div>
      </form>
    </section>
  );
}
