(function() {

  const connectors = [
    {name: 'Linkedin', hostname: 'www.linkedin.com', connector: LinkedinConnector}
    {name: 'Hopwork', hostname: 'www.hopwork.fr', connector: HopworkConnector}
  ];
  const config     = {};
  const hostname   = window.location.hostname;
  const Connector  = getConnector(hostname);

  if(Connector) {
    const Iago = new Connector(config);
  }

  function getConnector(hostname) {
    const availableConnectors = connectors.filter(connector => connector.hostname == hostname);

    return availableConnectors && availableConnectors.length ? availableConnectors[0].connector : null;
  }
}();
