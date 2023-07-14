/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

//import {Logger, ConsoleLogger} from 'react-console-logger';
import React,  {useState}  from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  NativeModules,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

const {ZebraDatawedge} = NativeModules;

function Section({children, title}: SectionProps): JSX.Element {

  const isDarkMode = useColorScheme() === 'dark';

  const [barcode_data, setbarcode_data] = useState("...");
  const [barcode_symb, setbarcode_symb] = useState("...");

  const dwCallback = (data:string, symb:string, gmt:string) => { //lower-cap string!
  
    console.log(`RN App.tsx/dwCallback - DW Scan: ${data} ${symb} ${gmt}`);

    setbarcode_data(data);
    setbarcode_symb(symb);
    
  }

  const handlePressScan = () => {
    console.log('RN Scan button pressed');
    ZebraDatawedge.dwTriggerScannerStart();

  };

  ZebraDatawedge.dwInit( dwCallback );

  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>

      <Button
        title="Scan!"
        color="#f194ff"
        onPress={handlePressScan}
      />

      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {barcode_data} - {barcode_symb}
      </Text>
    </View>
  );
}



function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };



  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Datawedge">
            Edit <Text style={styles.highlight}>App.tsx</Text> and greet Nicholas!
          </Section>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
