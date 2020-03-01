console.log("Opening Raspberry Pi Settings page");


function mySettings(props) {
  return (
    <Page>
      <Section
        title={<Text bold align="center">Raspberry Config</Text>}>
        <TextInput
           title="Set IP"
           settingsKey="ipAddress"
           label="Socket IP Address:Port"
           placeholder="IP for Socket Server:Port number"
        />
        <Text>Increase/Decrease steps for analog value is: {props.settingsStorage.getItem('steps')}</Text>
        <Slider
           settingsKey="stepAnalog"
           min="0"
           max="100"
           onChange={value => props.settingsStorage.setItem('steps', value)}
       />
      </Section>
    </Page>
  );
}

registerSettingsPage(mySettings);
