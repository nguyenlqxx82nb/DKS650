using ReactNative.Bridge;
using System;
using System.Collections.Generic;
using Windows.ApplicationModel.Core;
using Windows.UI.Core;

namespace React.Native.Bte.Lib.RNReactNativeBteLib
{
    /// <summary>
    /// A module that allows JS to share data.
    /// </summary>
    class RNReactNativeBteLibModule : NativeModuleBase
    {
        /// <summary>
        /// Instantiates the <see cref="RNReactNativeBteLibModule"/>.
        /// </summary>
        internal RNReactNativeBteLibModule()
        {

        }

        /// <summary>
        /// The name of the native module.
        /// </summary>
        public override string Name
        {
            get
            {
                return "RNReactNativeBteLib";
            }
        }
    }
}
