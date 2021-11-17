/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
window.localStorage.setItem('base_url', 'https://sandy.hotelkontena.com/api');
// window.localStorage.setItem('base_url', 'http://128.199.145.173:9888/api');

document.addEventListener("deviceready", onDeviceReadyFCM, false);
 
function onDeviceReadyFCM(){
    // FCMPlugin.onNotification(function(data){
    //     if(data.wasTapped){
    //       //Notification was received on device tray and tapped by the user.
    //       // window.localStorage.setItem('notif.title', data.title);
    //     }else{
    //       //Notification was received in foreground. Maybe the user needs to be notified.
    //       // window.localStorage.setItem('notif.title', data.title);
    //     }
    // });
}

function money(n) {
    return n.toLocaleString('en-US', {minimumFractionDigits: 0});
}

$.fn.digits = function(){ 
    return this.each(function(){ 
        $(this).text( $(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") ); 
    })
}

