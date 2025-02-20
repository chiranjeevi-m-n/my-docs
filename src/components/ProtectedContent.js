import React, { useState } from 'react';
import styles from './ProtectedContent.module.css';  // Import external CSS

const ProtectedContent = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");  // State for error message

  const checkPassword = () => {
    if (password === "Secret123") {
      setIsAuthorized(true);
      setErrorMessage("");  // Clear error message
    } else {
      setErrorMessage("❌ Incorrect password! Please try again.");  // Show error message
    }
  };

  return (
    <div className={styles.container}>
      {!isAuthorized ? (
        <div className={styles.authBox}>
          <input
            type="password"
            className={styles.inputField}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="🔒 Enter Password"
          />
          <button className={styles.submitButton} onClick={checkPassword}>
            Submit
          </button>
          {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}  {/* Error Message Display */}
        </div>
      ) : (
        <div className={styles.protectedContent}>
          {children}
        </div>
      )}
    </div>
  );
};

export default ProtectedContent;
