module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "subject-case": [1, "never", ["start-case", "pascal-case"]],
    "header-max-length": [1, "always", 72],
  },
  ignores: [(message) => message.toLowerCase().includes("wip") || message.toLowerCase().includes("merge") || message.toLowerCase().includes("upstream")],
};
