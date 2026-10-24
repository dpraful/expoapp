import React, { useState, useEffect, useContext } from 'react'
import { View, Text,TextInput, StatusBar, Dimensions, ImageBackground, TouchableHighlight, Image, StyleSheet } from 'react-native'
import Icons from '../Common/Icons'
import { normalize } from '../CommonStyle/ComponentFunctions'
import { getLoading, notifyMessage, ValueCheck } from '../CommonStyle/ComponentFunctions'
import NetworkServiceCall from '../Common/NetworkServiceCall'
import { APIURL } from '../Common/apiConstants'
import Loader from '../CommonStyle/Loader'
import { Global } from '../Common/Global'
import axios from 'axios'
import { useRouter } from 'expo-router';
import HShadowButton from '../HOC/HShadowButton';


const image = { uri: 'https://t4.ftcdn.net/jpg/05/19/65/81/360_F_519658132_FkvYwAjuJ8q67PGQUgYLrumVymaJtlZj.jpg' };
const styles = StyleSheet.create({
    passwordVisibilityButton: {
        minWidth: normalize(40),
        minHeight: normalize(40),
        paddingHorizontal: 0,
        paddingVertical: 0,
        borderRadius: 0,
        backgroundColor: 'transparent',
        elevation: 0,
        shadowOpacity: 0,
    },
});

export default function ForgotPassword({ }) {
    const router = useRouter()
    const [stage, setStage] = useState(1)
    const [text, setText] = useState('')
    const [msg, setMsg] = useState('')
    const [isLoading, setIsLoading] = useState(false);
    const [password, setPassword] = useState({
        "oldpass": "",
        "newpass": "",
        "confirmpass": ""
    })

    useEffect(() => {
        setPassword({
            "newpass": "",
            "confirmpass": ""
        })
        setMsg("")
    }, [stage])

    function actionJWT() {
        if ((password.oldpass && text)) {

            let buttonapi = APIURL + "auth/authenticate"
            var PostArr = {
                "username": text,
                "password": password.oldpass,
            }
            console.log("FORGOT PASSWORD", JSON.stringify(buttonapi))
            console.log("OUT", JSON.stringify(PostArr))
            axios.post(buttonapi, PostArr)
                .then(function (response) {
                    if (response.status == 200) {
                        console.log('success', response.data)
                        Global.JWTToken = response.data
                    }
                    else {
                        notifyMessage("Please check old password", 2)
                    }
                })
                .catch(function (error) {
                    notifyMessage("Error", 3)
                })
        }
    }


    const [isPasswordSecure, setIsPasswordSecure] = useState(true);
    const [isPasswordSecureTwo, setIsPasswordSecureTwo] = useState(true);
    return (
        <View style={{ flex: 1, marginTop: StatusBar.currentHeight, backgroundColor: "#fff" }}>
            <StatusBar translucent backgroundColor="transparent" barStyle={'dark-content'} />
            <ImageBackground source={image} resizeMode="cover"
                style={{ flex: 1 }}>
                <View style={{ height: normalize(50) }}>
                    <HShadowButton
                        hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
                        buttonstyle={{
                            left: 30,
                            top: 10,
                            width: normalize(40),
                            height: normalize(40),
                            paddingHorizontal: 0,
                            paddingVertical: 0,
                            borderRadius: 0,
                            backgroundColor: 'transparent',
                            elevation: 0,
                            shadowOpacity: 0,
                        }}
                        buttonCallback={() => stage == 1 ? router.back() : setStage(stage - 1)}>
                        <Icons.FontAwesome5 name={"arrow-left"} color={"black"} size={normalize(20)} />
                    </HShadowButton>
                </View>

                {stage == 1 ?
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <Icons.FontAwesome5 name={"lock"} color={"black"} size={normalize(50)} />
                        <Text style={{ fontWeight: 'bold', fontSize: normalize(25) }}>CHANGE</Text>
                        <Text style={{ fontWeight: 'bold', fontSize: normalize(25) }}>PASSWORD</Text>
                        <Text style={{ textAlign: 'center', paddingVertical: normalize(10) }}>Provide your account's userid for which you want to reset password.</Text>

                        <View style={{
                            width: Dimensions.get('screen').width * 0.9,
                            flexDirection: 'row',
                            alignItems: 'center',
                            borderWidth: 1,
                            borderColor: '#79747e',
                            borderRadius: 4,
                            paddingHorizontal: normalize(10),
                        }}>
                            <Icons.MaterialCommunityIcons name="clock-time-five-outline" color="purple" size={normalize(20)} />
                            <TextInput
                                value={text}
                                keyboardType={'numeric'}
                                onChangeText={text => setText(text)}
                                placeholder="Enter User ID"
                                autoFocus={true}
                                style={{ flex: 1, height: normalize(48), paddingHorizontal: normalize(8) }}
                            />
                        </View>

                        <TouchableHighlight
                            underlayColor={'lightblue'}
                            onPress={() => ValueCheck(text) ? setStage(2) : notifyMessage("Please enter required details", 3)}
                            style={{
                                width: Dimensions.get('screen').width * 0.9, justifyContent: 'center',
                                height: normalize(40), backgroundColor: '#FADF00', marginTop: normalize(10), alignItems: 'center'
                            }}>
                            <Text style={{ fontWeight: 'bold' }}>NEXT</Text>
                        </TouchableHighlight>
                    </View> : null}

                {stage == 2 ?
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <Icons.MaterialCommunityIcons name={"credit-card-lock-outline"} color={"black"} size={normalize(50)} />
                        <Text style={{ fontWeight: 'bold', fontSize: normalize(25) }}>NEW</Text>
                        <Text style={{ fontWeight: 'bold', fontSize: normalize(25) }}>CREDENTIALS</Text>
                        <Text style={{ textAlign: 'center', fontSize: normalize(13) }}>Set your new password , by confirming old password</Text>

                        <View style={{ marginTop: normalize(10) }}>
                            <View style={{
                                width: Dimensions.get('screen').width * 0.9,
                                flexDirection: 'row',
                                alignItems: 'center',
                                borderWidth: 1,
                                borderColor: '#79747e',
                                borderRadius: 4,
                                paddingHorizontal: normalize(10),
                            }}>
                                <Icons.MaterialCommunityIcons name="lock" color="purple" size={normalize(20)} />
                                <TextInput
                                    autoFocus={true}
                                    value={password.oldpass}
                                    secureTextEntry={isPasswordSecure}
                                    onChangeText={text => setPassword({ ...password, "oldpass": text })}
                                    placeholder="Old Password"
                                    onEndEditing={() => actionJWT()}
                                    style={{ flex: 1, height: normalize(48), paddingHorizontal: normalize(8) }}
                                />
                                <HShadowButton
                                    buttonstyle={styles.passwordVisibilityButton}
                                    accessibilityRole="button"
                                    accessibilityLabel={isPasswordSecure ? 'Show password' : 'Hide password'}
                                    buttonCallback={() => setIsPasswordSecure(!isPasswordSecure)}>
                                    <Icons.MaterialCommunityIcons name={isPasswordSecure ? "eye-off" : "eye"} color="purple" size={normalize(20)} />
                                </HShadowButton>
                            </View>
                        </View>

                        <View style={{ marginTop: normalize(15) }}>
                            <Text style={{ alignSelf: 'flex-end', fontWeight: 'bold', color: msg == "Easy" ? 'red' : 'darkblue' }}>{msg}</Text>
                            <View style={{
                                width: Dimensions.get('screen').width * 0.9,
                                flexDirection: 'row',
                                alignItems: 'center',
                                borderWidth: 1,
                                borderColor: '#79747e',
                                borderRadius: 4,
                                paddingHorizontal: normalize(10),
                            }}>
                                <Icons.MaterialCommunityIcons name="lock" color="purple" size={normalize(20)} />
                                <TextInput
                                    value={password.newpass}
                                    secureTextEntry={isPasswordSecure}
                                    onChangeText={text => setPassword({ ...password, "newpass": text })}
                                    onEndEditing={() => checkPasswordStrength(password.newpass)}
                                    placeholder="New Password"
                                    style={{ flex: 1, height: normalize(48), paddingHorizontal: normalize(8) }}
                                />
                                <HShadowButton
                                    buttonstyle={styles.passwordVisibilityButton}
                                    accessibilityRole="button"
                                    accessibilityLabel={isPasswordSecure ? 'Show password' : 'Hide password'}
                                    buttonCallback={() => setIsPasswordSecure(!isPasswordSecure)}>
                                    <Icons.MaterialCommunityIcons name={isPasswordSecure ? "eye-off" : "eye"} color="purple" size={normalize(20)} />
                                </HShadowButton>
                            </View>
                        </View>

                        <View style={{
                            width: Dimensions.get('screen').width * 0.9,
                            flexDirection: 'row',
                            alignItems: 'center',
                            borderWidth: 1,
                            borderColor: '#79747e',
                            borderRadius: 4,
                            paddingHorizontal: normalize(10),
                            marginTop: normalize(20),
                        }}>
                            <Icons.MaterialCommunityIcons name="lock" color="purple" size={normalize(20)} />
                            <TextInput
                                value={password.confirmpass}
                                secureTextEntry={isPasswordSecureTwo}
                                onChangeText={text => setPassword({ ...password, "confirmpass": text })}
                                placeholder="Confirm Password"
                                style={{ flex: 1, height: normalize(48), paddingHorizontal: normalize(8) }}
                            />
                            <HShadowButton
                                buttonstyle={styles.passwordVisibilityButton}
                                accessibilityRole="button"
                                accessibilityLabel={isPasswordSecureTwo ? 'Show password' : 'Hide password'}
                                buttonCallback={() => setIsPasswordSecureTwo(!isPasswordSecureTwo)}>
                                <Icons.MaterialCommunityIcons name={isPasswordSecureTwo ? "eye-off" : "eye"} color="purple" size={normalize(20)} />
                            </HShadowButton>
                        </View>

                        <TouchableHighlight
                            underlayColor={'lightblue'}
                            onPress={() => getUpdate()}
                            style={{
                                width: Dimensions.get('screen').width * 0.9, justifyContent: 'center',
                                height: normalize(40), backgroundColor: '#FADF00', marginTop: normalize(10), alignItems: 'center'
                            }}>
                            <Text style={{ fontWeight: 'bold' }}>UPDATE</Text>
                        </TouchableHighlight>
                    </View> : null}

                {stage == 3 ?
                    <View style={{ flex: 1, backgroundColor: "#fff", alignItems: 'center' }}>

                        <Icons.EvilIcons name={"check"} color={"green"} size={normalize(100)} />
                        <Text style={{ fontWeight: 'bold', fontSize: normalize(20), color: "green" }}>Password Updated</Text>
                        <Text style={{ textAlign: 'center', fontSize: normalize(14), color: "black", paddingVertical: normalize(5) }}>Your password changed successfully ! Use your new password to log in</Text>

                        <TouchableHighlight
                            underlayColor={'lightblue'}
                            onPress={() => { setStage(1), router.back() }}
                            style={{
                                width: Dimensions.get('screen').width * 0.9, justifyContent: 'center',
                                height: normalize(40), backgroundColor: '#FADF00', marginTop: normalize(10), alignItems: 'center'
                            }}>
                            <Text style={{ fontWeight: 'bold' }}>LOGIN</Text>
                        </TouchableHighlight>
                    </View>
                    : null}
            </ImageBackground>

            {isLoading ?
                <Loader displaytext={true} />
                : null}
        </View>
    )

    function getUpdate() {
        if (password.newpass != ""
            && password.confirmpass != "") {
            if (password.newpass == password.confirmpass) {

                var ReqJson = {
                    "groups": {
                        "procedurename": "suuserforgetpassword1",
                        "userid": text,
                        ...password
                    }
                }
                console.log("Add Component>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", JSON.stringify(ReqJson))
                let buttonapi = APIURL + 'commontemplatesave/RnCommonTemplateSave';
                console.log("**************************************", JSON.stringify(buttonapi))
                setIsLoading(true)
                NetworkServiceCall('post', buttonapi, ReqJson, Global.JWTToken).then(function (response) {
                    console.log("REPOSNEEEEEEE", JSON.stringify(response))
                    if (response.httpstatus == 200
                        && response.data != undefined && response.data != null
                        && response.data.code != undefined && response.data.code > 0) {
                        notifyMessage('Password Updated !!!', 1);
                        setStage(3)
                        console.log("Password Updated !!!", password.newpass)
                        setIsLoading(false);

                    } else {
                        notifyMessage('Password Not Updated !!! Please check old password', 2);
                        setIsLoading(false);
                    }
                })

                getLoading(v => setIsLoading(false))

            } else {
                notifyMessage("Oops...Passwords does not match each other", 4)
            }
        } else {
            notifyMessage("Please fill out passwords", 3)
        }
    }

    function checkPasswordStrength(password) {
        // Initialize variables
        var strength = 0;
        var tips = "";

        // Check password length
        if (password.length < 8) {
            tips += "Make the password longer. ";
        } else {
            strength += 1;
        }

        // Check for mixed case
        if (password.match(/[a-z]/) && password.match(/[A-Z]/)) {
            strength += 1;
        } else {
            tips += "Use both lowercase and uppercase letters. ";
        }

        // Check for numbers
        if (password.match(/\d/)) {
            strength += 1;
        } else {
            tips += "Include at least one number. ";
        }

        // Check for special characters
        if (password.match(/[^a-zA-Z\d]/)) {
            strength += 1;
        } else {
            tips += "Include at least one special character. ";
        }



        // Return results
        if (strength < 2) {
            return setMsg("Easy", notifyMessage(tips, 5));
        } else if (strength === 2) {
            return setMsg("Medium Difficulty", notifyMessage(tips, 5));
        } else if (strength === 3) {
            return setMsg("Difficult", notifyMessage(tips, 5));
        } else {
            return setMsg("Extremely difficult");
        }
    }
}
