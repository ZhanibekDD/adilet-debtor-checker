const axios = require('axios');
const xml2js = require('xml2js');
const { v4: uuidv4 } = require('uuid');
const { env } = require('../config/env');

async function requestDebtorData(iin) {
  if (!env.egovApiKey) {
    return { source: 'mock', rows: null, rawStatus: 'API key is not configured' };
  }

  const messageId = uuidv4();
  const messageDate = new Date().toISOString().replace(/Z$/, '+06:00');
  const body = `
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:soap="http://soap.opendata.egov.nitec.kz/">
   <soapenv:Header/>
   <soapenv:Body>
      <soap:request>
         <request>
            <requestInfo>
               <messageId>${messageId}</messageId>
               <messageDate>${messageDate}</messageDate>
               <indexName>aisoip</indexName>
               <apiKey>${env.egovApiKey}</apiKey>
            </requestInfo>
            <requestData>
               <data xmlns:ns2pep="http://bip.bee.kz/SyncChannel/v10/Types/Request" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="ns2pep:RequestMessage">
                  <iinOrBin>${iin}</iinOrBin>
               </data>
            </requestData>
         </request>
      </soap:request>
   </soapenv:Body>
</soapenv:Envelope>`;

  const response = await axios.post(env.egovApiUrl, body, {
    headers: { 'Content-Type': 'text/xml;charset=UTF-8' },
    timeout: env.requestTimeoutMs,
  });

  const parser = new xml2js.Parser({ explicitArray: false, ignoreAttrs: true });
  const parsed = await parser.parseStringPromise(response.data);
  const responseInfo =
    parsed?.['soap:Envelope']?.['soap:Body']?.['ns1:requestResponse']?.response?.responseInfo;
  const rows =
    parsed?.['soap:Envelope']?.['soap:Body']?.['ns1:requestResponse']?.response?.responseData?.data?.rows ||
    null;

  return {
    source: 'egov',
    rows,
    rawStatus: responseInfo?.status?.message || 'ok',
  };
}

module.exports = { requestDebtorData };
