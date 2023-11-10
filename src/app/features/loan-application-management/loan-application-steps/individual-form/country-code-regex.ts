export const CountryMobileNumberRegex: { [key: string]: any } = {
  '1': /^1-\d{3}-\d{3}-\d{4}$/, // USA
  '44': /^44-\d{4}-\d{6}$/, // UK
  '61': /^61-4\d{8}$/, // Australia
  '86': /^86-1[3456789]\d{9}$/, // China
  '91': /^91-[6789]\d{9}$/, // India
  '33': /^33-\d{9}$/, // France
  '49': /^49-\d{5,12}$/, // Germany
  '81': /^81-\d{10}$/, // Japan

  '267': /^267-7\d{3}\d{4}$/, // Botswana
  '260': /^260-9[567]\d{7}$/, // Zambia
  '264': /^264-81\d{8}$/, // Namibia
  '265': /^265-99\d{7}$/, // Malawi
  '266': /^266-5\d{7}$/, // Lesotho
  '268': /^268-7[89]\d{6}$/, // Swaziland (Eswatini)
  '27': /^27-8[2345679]\d{7}$/, // South Africa

  '255': /^255-7[1-9]\d{7}$/, // Tanzania

  '352': /^352-6\d{8}$/, // Luxembourg

  // Add more country codes and regex patterns as needed
};
