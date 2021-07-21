import React from "react";
import Lottie from "react-lottie";
import animationData from "./loader.json";

const styles = {
  container: {
    backgroundColor: "#e6e6e6",
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1040,
    padding: 0
  }
};

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData
};

const LoadingSignIn = () => (
  <div style={styles.container}>
    <Lottie
      options={defaultOptions}
      height={200}
      width={200}
      speed={2}
    />
  </div>
);

export default LoadingSignIn;
