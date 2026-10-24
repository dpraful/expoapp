
export class Global {
  static userData;
  static userOptions;
  static ipAddress;
  static port;
  static ApiVersion;
  static InstallationKey = '';
  static dashdata;
  static AppTheme = {
    primary_color: Global.betaversion ? Global.betacolor : '#094485',
    login_background_color: '#f3f4f6',
    login_surface_color: '#ffffff',
    login_primary_color: '#f4511e',
    login_heading_color: '#17212d',
    login_text_color: '#17212d',
    login_subtitle_color: '#89919a',
    login_placeholder_color: '#929aa3',
    login_border_color: '#e2e6e9',
    login_link_color: '#c65b36',
    login_icon_color: '#75808a',
    login_alert_text_color: '#2c3e50',
    login_shadow_color: '#000000',
    login_overlay_color: 'rgba(23,33,45,0.28)',
    secondary_color: 'black',
    text_color: '#fff',
    heading_text_color: 'darkblue',
    bg_button: '#fff',
    icon_color: 'darkblue',
    selected_color: "#d7ffbc",
    blur_color: 'rgba(255,255,255,0.6)',
    error_color: '#D32F2F'
  };

  static betaversion = false;
  static betacolor = '#ff5722';
  static ipAddress = "100.105.213.12";
  static port = 8000;
  static version = "2025120600";
  static module = '8';
  static hospitalcode = 1;
  static asyncStorageAppKey = '@storage_KeySideKick';
  static asyncStorageThemeKey = '@storage_ThemeSidekick';
  static licenseIp = "http://" + Global.ipAddress + ":" + Global.port + "/pixaget/commonget/licensevalidation";
  static url = `http://${Global.ipAddress}:${Global.port}/`;
  static preinstallationkey = 'sidekick@2026';
  static versiondate = '09.10.2025';
  static SplashHeading = 'TEST APP';
  static logoUrl = `http://${Global.ipAddress}:${Global.port}/pixamget/commonmget/sidekick_logo.jpg`;
}
