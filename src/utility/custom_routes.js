const customRoutes = [
  {
    path: "/health-check",
    method: ["GET"],
    handler: (req, res) => {
      res.writeHead(200);
      res.end("UP!");
    },
  },
  {
    path: "/",
    method: ["GET"],
    handler: (req, res) => {
      res.writeHead(200);
      res.end("Jira Slack Connection POC!");
    },
  },
];

module.exports = { customRoutes };
