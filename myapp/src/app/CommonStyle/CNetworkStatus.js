import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { normalize } from '../CommonStyle/ComponentFunctions';
import HOCIcons from '../HOC/HOCIcons';
import ABlink from '../Alerts/ABlink';

const CNetworkStatus = () => {
  const [networkInfo, setNetworkInfo] = useState({});

  useEffect(() => {
    // Function to handle network state changes
    const unsubscribe = NetInfo.addEventListener(state => {
      setNetworkInfo({
        isConnected: state.isConnected,
        isInternetReachable: state.isInternetReachable,
        connectionType: state.type,
        effectiveType: state.effectiveType,
        isExpensive: state.isExpensive,
        details: state.details,
      });
    });

    // Cleanup on component unmount
    return () => unsubscribe();
  }, []);

  function IconButton(icongroup, iconname, text) {

    return (
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <HOCIcons.Icons
          icongroup={icongroup}
          name={iconname}
          size={normalize(15)}
          color={'white'}
          style={{
            textShadowColor: '#ffffff',
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 1,
          }}
        />
        <Text style={{
          color: 'white',
          fontSize: normalize(7),
          textShadowColor: '#ffffff',
          textShadowOffset: { width: 0.5, height: 0.5 },
          textShadowRadius: 0.5,
          textAlign: 'center'
        }}>{text}</Text>
      </View>
    )

  }

  function NetWorkIcons() {

    if (networkInfo.isConnected) {
      if (networkInfo.connectionType === 'cellular') {
        if (networkInfo.isInternetReachable) {
          // return (
          //   IconButton(3, 'signal', "Mobile Data")
          // )
          return (
            <View>

            </View>
          )
        }
        else {
          // return (
          //   IconButton(2, 'signal-cellular-connected-no-internet-4-bar', "Mobile Data")
          // )
          return (
            <View>

            </View>
          )
        }
      }
      else if (networkInfo.connectionType === 'wifi') {
        if (networkInfo.isInternetReachable) {
          // return (
          //   IconButton(3, 'wifi', "Wifi")
          // )
          return (
            <View>

            </View>
          )
        }
        else {
          // return (
          //   IconButton(3, 'wifi-strength-4-alert', "Wifi")
          // )
          return (
            <View>

            </View>
          )
        }
      }
      else {
        return (
          <View>

          </View>
        )
      }
    }
    else {
      return (
        <ABlink>
          <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', borderRadius: 10, padding: normalize(4) }}>
            <View style={{ flexDirection: 'row' }}>
              <HOCIcons.Icons
                icongroup={3}
                name={'wifi-off'}
                size={normalize(20)}
                color={'red'}
                style={{
                  textShadowColor: '#ffffff',
                  textShadowOffset: { width: 1, height: 1 },
                  textShadowRadius: 1,
                }}
              />
              <HOCIcons.Icons
                icongroup={3}
                name={'signal-off'}
                size={normalize(20)}
                color={'red'}
                style={{
                  textShadowColor: '#ffffff',
                  textShadowOffset: { width: 1, height: 1 },
                  textShadowRadius: 1,
                }}
              />
            </View>
            <Text style={{
              color: 'red',
              fontSize: normalize(9),
              textShadowColor: '#ffffff',
              textShadowOffset: { width: 0.5, height: 0.5 },
              textShadowRadius: 0.5,
            }}>NO NETWORK</Text>
          </View>
        </ABlink>
      )
    }


  }

  return (

    <View style={{ flexDirection: 'row' }}>
      {NetWorkIcons()}
      {/* {networkInfo.isConnected && networkInfo.isInternetReachable && networkInfo.connectionType === 'cellular' ?
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>

          <HOCIcons.Icons
            icongroup={3}
            name={'signal'}
            size={normalize(20)}
            color={'darkblue'}
            style={{
              textShadowColor: '#ffffff',
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 1,
            }}
          />
          <Text style={{
            color: 'darkblue',
            fontSize: normalize(9),
            textShadowColor: '#ffffff',
            textShadowOffset: { width: 0.5, height: 0.5 },
            textShadowRadius: 0.5,
          }}>{"Mobile Data"}</Text>
        </View>
        : null} */}
      {/* {networkInfo.isConnected && networkInfo.isInternetReachable && networkInfo.connectionType === 'wifi' ?
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>

          <HOCIcons.Icons
            icongroup={3}
            name={'wifi'}
            size={normalize(20)}
            color={'darkblue'}
            style={{
              textShadowColor: '#ffffff',
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 1,
            }}
          />
          <Text style={{
            color: 'darkblue',
            fontSize: normalize(9),
            textShadowColor: '#ffffff',
            textShadowOffset: { width: 0.5, height: 0.5 },
            textShadowRadius: 0.5,
          }}>{"Wifi"}</Text>
        </View>
        : null} */}
      {/* <Text style={styles.infoText}>Internet Reachable: {networkInfo.isInternetReachable ? 'Yes' : 'No'}</Text> */}
      {/* {networkInfo.isConnected && networkInfo.isInternetReachable ? null :
        <ABlink>
          <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', borderRadius: 10, padding: normalize(4) }}>
            <View style={{ flexDirection: 'row' }}>
              <HOCIcons.Icons
                icongroup={3}
                name={'wifi-off'}
                size={normalize(20)}
                color={'red'}
                style={{
                  textShadowColor: '#ffffff',
                  textShadowOffset: { width: 1, height: 1 },
                  textShadowRadius: 1,
                }}
              />
              <HOCIcons.Icons
                icongroup={3}
                name={'signal-off'}
                size={normalize(20)}
                color={'red'}
                style={{
                  textShadowColor: '#ffffff',
                  textShadowOffset: { width: 1, height: 1 },
                  textShadowRadius: 1,
                }}
              />
            </View>
            <Text style={{
              color: 'red',
              fontSize: normalize(9),
              textShadowColor: '#ffffff',
              textShadowOffset: { width: 0.5, height: 0.5 },
              textShadowRadius: 0.5,
            }}>NO NETWORK</Text>
          </View>
        </ABlink> */}
      {/* } */}


    </View>

  )
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent: 'flex-start',
    // padding: 20,
    // backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16
    // marginBottom: 10,
  },
});

export default CNetworkStatus;




// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, ScrollView } from 'react-native';
// import NetInfo from '@react-native-community/netinfo';

// const NetworkStatus = () => {
//   const [networkInfo, setNetworkInfo] = useState({});

//   useEffect(() => {
//     // Function to handle network state changes
//     const unsubscribe = NetInfo.addEventListener(state => {
//       setNetworkInfo({
//         isConnected: state.isConnected,
//         isInternetReachable: state.isInternetReachable,
//         connectionType: state.type,
//         effectiveType: state.effectiveType,
//         isExpensive: state.isExpensive,
//         details: state.details,
//       });
//     });

//     // Cleanup on component unmount
//     return () => unsubscribe();
//   }, []);

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.title}>Network Information</Text>
//       <Text style={styles.infoText}>Connection Status: {networkInfo.isConnected ? 'Connected' : 'Disconnected'}</Text>
//       <Text style={styles.infoText}>Internet Reachable: {networkInfo.isInternetReachable ? 'Yes' : 'No'}</Text>
//       <Text style={styles.infoText}>Connection Type: {networkInfo.connectionType}</Text>
//       <Text style={styles.infoText}>Effective Type: {networkInfo.effectiveType}</Text>
//       <Text style={styles.infoText}>Expensive Connection: {networkInfo.isExpensive ? 'Yes' : 'No'}</Text>

//       {/* Show network details if available */}
//       {networkInfo.details && (
//         <>
//           <Text style={styles.infoText}>IP Address: {networkInfo.details.ipAddress || 'N/A'}</Text>
//           <Text style={styles.infoText}>SSID: {networkInfo.details.ssid || 'N/A'}</Text>
//           <Text style={styles.infoText}>Carrier: {networkInfo.details.carrier || 'N/A'}</Text>
//         </>
//       )}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'flex-start',
//     padding: 20,
//     backgroundColor: '#f0f0f0',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   infoText: {
//     fontSize: 16,
//     marginBottom: 10,
//   },
// });

// export default NetworkStatus;

