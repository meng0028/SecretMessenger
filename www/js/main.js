/*****************************************************************
File: main.js
Authors: Yanming Meng  Jonathan Dure
Description: MAD 9022 Final Project - Secret Messenger App
Here is the sequence of logic for the app
-The app must have a custom launcher icon and splashscreen image.
-There will be a single screen for login and register.
-There will be a screen showing list of available messages for the logged in user. This screen should only be accessible after the user logs in.
-There will screen for taking a picture with the device camera and then embedding a message in that image and sending it to a selected user's message queue.
-The user must be logged in to see this screen.
-There will be one screen for displaying the downloaded image and message that was embedded. The user must be logged in to access this screen.
Version: 0.0.1
Updated: April 25, 2017
*****************************************************************/
'use strict';
var app = {
	//declare global variables
	userId: null
	, userGuid: null
	, senderID: null
	, msgID: null
	, mainURL: "https://griffis.edumedia.ca/mad9022/steg/"
	, init: function () {
		document.addEventListener('deviceready', app.onDeviceReady);
	}
	, onDeviceReady: function () {
			// add event listeners to all button
			document.getElementById('loginBtn').addEventListener('touchend', app.login);
			document.getElementById('registerBtn').addEventListener('touchend', app.register);
			document.getElementById('newMsgBtn').addEventListener('touchend', app.newMsgModal);
			document.getElementById('cancelMsgBtn').addEventListener('touchend', app.cancelMsgModal);
			document.getElementById('takePictureBtn').addEventListener('touchend', app.takePicture);
			document.getElementById('sendMsgBtn').addEventListener('touchend', app.sendMsg);
			document.getElementById('deleteMsgBtn').addEventListener('touchend', app.deleteMsg);
			document.getElementById('replyMsgBtn').addEventListener('touchend', app.replyMsg);
		}
		// login function
		
	, login: function () {
			let username = document.getElementById('userName').value;
			let email = document.getElementById('userEmail').value;
			// if missing enter field, return errors
			if (username == "" || email == "") {
				document.getElementById("error").innerHTML = "Missing required fields";
			}
			else {
				document.getElementById("msgList").innerHTML = "";
				document.getElementById("error").innerHTML = "";
				let formData = new FormData();
				formData.append("user_name", username);
				formData.append("email", email);
				let options = {
					method: 'post'
					, mode: 'cors'
					, body: formData
				};
				// fetching data from login php page
				let req = new Request("https://griffis.edumedia.ca/mad9022/steg/login.php");
				fetch(req, options).then(function (response) {
					return response.json();
				}).then(function (data) {
					if (data.code != 0) {
						document.getElementById("error").innerHTML = data.message;
					}
					else {
						app.userId = data.user_id;
						app.userGuid = data.user_guid;
						document.getElementById("error").innerHTML = "";
						app.showMsgList();
					}
				}).catch(function (err) {
					alert(err.message);
				});
			}
		}
		// register function
		
	, register: function () {
			let username = document.getElementById("username").value;
			let email = document.getElementById("email").value;
			// if missing enter field, return errors
			if (username == "" || email == "") {
				document.getElementById("error").innerHTML = "Missing required fields";
			}
			else {
				document.getElementById("error").innerHTML = "";
				let formData = new FormData();
				formData.append("user_name", username);
				formData.append("email", email);
				let options = {
					method: 'post'
					, mode: 'cors'
					, body: formData
				};
				// fetching data from register php page
				let req = new Request("https://griffis.edumedia.ca/mad9022/steg/register.php");
				fetch(req, options).then(function (response) {
					return response.json();
				}).then(function (data) {
					if (data.code != 0) {
						document.getElementById("error").innerHTML = data.message;
					}
					else {
						app.userId = data.user_id;
						app.userGuid = data.user_guid;
						document.getElementById("error").innerHTML = "";
						app.showMsgList();
					}
				}).catch(function (err) {
					alert(err.message);
				});
			}
		}
		// show message list function
		
	, showMsgList: function () {
			let formData = new FormData();
			formData.append("user_id", app.userId);
			formData.append("user_guid", app.userGuid);
			let options = {
				method: 'post'
				, mode: 'cors'
				, body: formData
			};
			// fetching data from message list php page
			let reg = new Request("https://griffis.edumedia.ca/mad9022/steg/msg-list.php");
			fetch(reg, options).then(function (response) {
				return response.json();
			}).then(function (data) {
				// run loop to show existing messages
				for (var i = 0; i < data.messages.length; i++) {
					let name = data.messages[i].user_name;
					let msgId = data.messages[i].msg_id;
					let msgList = document.getElementById("msgList");
					let li = document.createElement("li");
					li.classList.add("table-view-cell");
					li.classList.add("media");
					let a = document.createElement("a");
					a.classList.add("navigate-right");
					a.classList.add("listItem");
					a.setAttribute("id", msgId);
					a.addEventListener("touchstart", app.viewDetails);
					let div = document.createElement("div");
					div.classList.add("media-body");
					let msg = "Message from: " + name;
					let msgText = document.createTextNode(msg);
					div.appendChild(msgText);
					a.appendChild(span);
					a.appendChild(div);
					li.appendChild(a);
					listOfMessages.appendChild(li);
				}
			}).catch(function (err) {
				alert(err.message);
			});
		}
		// new message modal function
		
	, newMsgModal: function () {
			let sendModal = document.getElementById("sendModal");
			sendModal.classList.toggle("active");
			let formData = new FormData();
			formData.append("user_id", app.userId);
			formData.append("user_guid", app.userGuid);
			let options = {
				method: 'post'
				, mode: 'cors'
				, body: formData
			};
			let reg = new Request("https://griffis.edumedia.ca/mad9022/steg/user-list.php");
			fetch(reg, options).then(function (response) {
				return response.json();
			}).then(function (data) {
				app.userList(data);
			}).catch(function (err) {
				alert(err.message);
			});
		}
		// show user list function
		
	, userList: function (data) {
			let userList = document.getElementById("userList");
			userList.innerHTML = "";
			data.users.forEach(function (element, index) {
				let id = element.user_id;
				let name = element.user_name;
				let option = document.createElement("option");
				option.value = id;
				option.text = name;
				userList.add(option);
			});
		}
		// show message detail function
		
	, msgDetailModal: function () {
		let msgId = ev.currentTarget.id;
		document.getElementById("detailModal").classList.add("active");
		let detailsDiv = document.getElementById("detailModal");
		detailsDiv.innerHTML = "";
		let h3 = document.createElement("h3");
		let txtNode = document.createTextNode(msgId);
		let formData = new FormData();
		formData.append("user_id", app.currentId);
		formData.append("user_guid", app.currentGuid);
		formData.append("message_id", msgId);
		let options = {
			method: 'post'
			, mode: 'cors'
			, body: formData
		};
		// fetching data from message get php page
		let req = new Request("https://griffis.edumedia.ca/mad9022/steg/msg-get.php");
		fetch(send, options).then(function (response) {
			return response.json();
		}).then(function (data) {
			if (data.code != 0) {
				document.getElementById("error").innerHTML = "Unable to read message";
			}
			else {
				let fromUser = document.getElementById("fromUser");
				msgDetailsDiv.innerHTML = "";
				let canvas = document.createElement("canvas");
				canvas.setAttribute("id", "picCanvas");
				let ctx = canvas.getContext('2d');
				let sentImg = document.createElement("img");
				sentImg.crossOrigin = "anonymous";
				sentImg.src = "https://griffis.edumedia.ca/mad9022/steg/" + data.image;
				sentImg.addEventListener('load', function (ev) {
					canvas.width = 300;
					canvas.height = 300;
					ctx.drawImage(sentImg, 0, 0);
					msgDetails.appendChild(canvas);
					let userId = BITS.getUserId(canvas);
					let txtMsg = BITS.getMessage(app.currentId, canvas);
					let msgDiv = document.getElementById("msgDiv");
					msgDiv.innerHTML = "";
					let msgP = document.createElement("p");
					msgP.innerHTML = txtMsg;
					msgDiv.appendChild(msgP);
				});
			}
		}).catch(function (err) {
			alert(err.message);
		});
	}
	, cancelMsgModal: function () {
		if (document.querySelector('.active').id == 'sendModal') {
			app.img = "";
			document.getElementById('msg-user').value = '';
			document.getElementById('msg-text').value = '';
			document.getElementById('msg-picture').src = 'img/logo.png';
			document.getElementById('msg-picture').classList.add('hidden');
			document.getElementById('msg-take-picture').classList.remove('hidden');
		}
		else {
			app.msgId = 0;
			app.sender = 0;
		}
		app.showMsgList();
	}
	, takePicture: function () {
		app.imageSend = imageURI;
		let takePictureBtn = document.getElementById("takePictureBtn");
		let sendMsgBtn = document.getElementById("sendMsgBtn");
		let msgPicture = document.getElementById("msgPicture");
		msgPicture.innerHTML = "";
		let canvas = document.createElement("canvas");
		canvas.setAttribute("id", "picCanvas");
		let ctx = canvas.getContext('2d');
		let img = document.createElement("img");
		img.crossOrigin = "anonymous";
		img.src = imageURI;
		img.addEventListener('load', function (ev) {
			canvas.width = 300;
			canvas.height = 300;
			ctx.drawImage(img, 0, 0);
		});
		takePictureBtn.style.display = "none";
		sendMsgBtn.style.display = "block";
		msgPicture.appendChild(canvas);
		takePictureBtn.addEventListener("touchstart", function () {
			app.sendMsg(canvas);
		});
	}
	, sendMsg: function (canvas) {
		app.encodeMsg();
		let myDataURL = canvas.toDataURL();
		app.dataURLToBlob(myDataURL).then(function (blob) {
			let userToSend = document.getElementById("userList").value;
			let msgToSend = document.getElementById("msgArea").value;
			let formData = new FormData();
			formData.append("user_id", app.currentId);
			formData.append("user_guid", app.currentGuid);
			formData.append("recipient_id", userToSend);
			formData.append("image", blob);
			let options = {
				method: 'post'
				, mode: 'cors'
				, body: formData
			};
			let send = new Request("https://griffis.edumedia.ca/mad9022/steg/msg-send.php");
			fetch(send, options).then(function (response) {
				return response.json();
			}).then(function (data) {
				c
				if (data.code != 0) {
					alert("Send-msg failed:\n" + data.message);
				}
				else {
					document.activeElement.blur();
					document.getElementById("msgArea").value = "";
					document.getElementById("imageBox").innerHTML = "";
					picBtn.style.display = "block";
					app.toggleSendModal();
				}
			}).catch(function (err) {
				alert(err.message);
			});
		});
	}
	, deleteMsg: function () {
		document.getElementById("msgList").innerHTML = "";
		let formData = new FormData();
		formData.append("user_id", app.currentId);
		formData.append("user_guid", app.currentGuid);
		formData.append("message_id", app.currentMsgId);
		let options = {
			method: 'post'
			, mode: 'cors'
			, body: formData
		};
		let reg = new Request("https://griffis.edumedia.ca/mad9022/steg/msg-delete.php");
		fetch(reg, options).then(function (response) {
			return response.json();
		}).then(function (data) {
			if (data.code != 0) {
				document.getElementById("error").innerHTML = data.message;
			}
			else {
				document.getElementById("listOfMessages").innerHTML = "";
				app.msgList();
				document.getElementById("msgDetails").classList.remove("active");
			}
		}).catch(function (err) {
			alert(err.message);
		});
	}
	, replyMsg: function () {
		let userId = ev.currentTarget.id;
		let formData = new FormData();
		formData.append("user_id", app.userId);
		formData.append("user_guid", app.userGuid);
		let options = {
			method: 'post'
			, mode: 'cors'
			, body: formData
		};
		let reg = new Request("https://griffis.edumedia.ca/mad9022/steg/user-list.php");
		fetch(reg, options).then(function (response) {
			return response.json();
		}).then(function (data) {
			app.userList(data);
		}).catch(function (err) {
			alert(err.message);
		});
	}
	, encodeMsg: function (ev) {
		let userId = document.getElementById("userList").value;
		let uBits = BITS.numberToBitArray(userId);
		let msg = document.getElementById("msgArea").value;
		let msgBits = BITS.stringToBitArray(msg);
		let canv = document.getElementById("picCanvas");
		let msgLength = msg.length;
		let bitLength = BITS.numberToBitArray(msgLength * 16);
		BITS.setUserId(uBits, canv);
		BITS.setMsgLength(bitLength, canv);
		BITS.setMessage(msgBits, canv);
	}
	, dataURLToBlob: function (dataURL) {
		return Promise.resolve().then(function () {
			var type = dataURL.match(/data:([^;]+)/)[1];
			var base64 = dataURL.replace(/^[^,]+,/, '');
			var buff = app.binaryStringToArrayBuffer(atob(base64));
			return new Blob([buff], {
				type: type
			});
		});
	}
	, binaryStringToArrayBuffer: function (binary) {
		var length = binary.length;
		var buf = new ArrayBuffer(length);
		var arr = new Uint8Array(buf);
		var i = -1;
		while (++i < length) {
			arr[i] = binary.charCodeAt(i);
		}
		return buf;
	}
};
app.init();