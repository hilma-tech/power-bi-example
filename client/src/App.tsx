import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

import { models } from 'powerbi-client';
import { PowerBIEmbed } from 'powerbi-client-react';
import axios from 'axios';


function App() {
  const [embedData, setEmbedData] = useState<{ id: string, embedToken: string, embedUrl: string } | null>(null);

  const getEmbedData = async () => {
    try {
      const res = await axios.get<{ id: string, embedToken: string, embedUrl: string }>("/api/powerbi");
      setEmbedData(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getEmbedData();
  }, []);


  return (
    <div>
      <PowerBIEmbed
        embedConfig={{
          type: "report",
          tokenType: models.TokenType.Embed,
          id: embedData?.id,
          accessToken: embedData?.embedToken,
          embedUrl: embedData?.embedUrl,
          settings: {
            panes: {
              filters: {
                expanded: false,
                visible: false
              },
              pageNavigation: {
                visible: false
              }
            },
          }
        }}
        cssClassName="power-bi-container"
      />
    </div>
  )

}

export default App;
