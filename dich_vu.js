
const http = require("http")
//Tham chiếu đến lib của token
const libToken = require("./libsToken");
// Khai báo cổng cho dịch vụ
const fs = require("fs");
const port = process.env.PORT || 8080;
//Tham chiếu queryString của node js 
require("dotenv").config();
//Tham chiếu đến thư viện của cloudinary
const imgCloud = require("./cloudinaryImages")
//Tham chiếu đến thư viện url của node js
const URI = require("url");
// Tham chiếu đến thư viện MongoDB
const db = require("./mongoDB");
//tham chiếu đến thư viện send mail
const sendMail = require("./sendMail");

//Tham chiếu thư viện sms
const sms = require("./XL_SMS")

const dich_vu = http.createServer((req, res) => {
    // Cấp quyền
    res.setHeader("Access-Control-Allow-Origin", "*");
    //Cấp quyền cho tính năng jwt
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "Authorization, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

    res.setHeader("Access-Control-Allow-Origin", '*');
    // Method
    let method = req.method;
    // url
    let url = req.url;


    let ket_qua = `Server Node JS - Method: ${method} - Url: ${url}`;
    //Method option để láy tham số từ header
    if (method == "OPTIONS") {
        console.log(res.statusCode)
        res.end("")
    }
    else if (method == "GET") {
        let param = {}
        param = URI.parse(url, true);
        url = param.pathname;
        let query = param.query
        if (url == "/dsTivi") {
            if (Object.keys(query).length == 0) {
                db.getAll("tivi").then((result) => {
                    ket_qua = JSON.stringify(result);
                    res.end(ket_qua);
                }).catch((err) => console.log(err));
            } else {
                console.log(param.query.Ma_so);
                let filter = {
                    "Ma_so": param.query.Ma_so
                }
                console.log(filter);
                db.getOne("tivi", filter).then(result => {
                    ket_qua = JSON.stringify(result);
                    res.end(ket_qua);
                }).catch((err) => console.log(err));
            }

        }
        else if (url == "/dsMathang") {

            if (!query.Ma_so) {
                db.getAll("food").then((result) => {
                    ket_qua = JSON.stringify(result);
                    res.end(ket_qua);
                }).catch((err) => console.log(err));

            } else {
                console.log(query.Ma_so);
                let filter = {
                    "Ma_so": param.query.Ma_so
                }
                console.log(filter);
                db.getOne("food", filter).then(result => {
                    ket_qua = JSON.stringify(result);
                    res.end(ket_qua);
                }).catch((err) => console.log(err));
            }

        }
        else if (url == "/dsDienthoai") {
            //Chứng thực access token

            if (!query.Ma_so) {
                db.getAll("mobile").then((result) => {
                    ket_qua = JSON.stringify(result);
                    res.end(ket_qua);
                }).catch((err) => console.log(err));

            } else {
                console.log(query.Ma_so);
                let filter = {
                    "Ma_so": param.query.Ma_so
                }
                console.log(filter);
                db.getOne("mobile", filter).then(result => {
                    ket_qua = JSON.stringify(result);
                    res.end(ket_qua);
                }).catch((err) => console.log(err));
            }

        }
        //Xử lý danh sách phiếu đặt 
        else if (url == "/dsPhieudat") {
            console.log(query);
            let collection = (query.nhom == "tivi") ? "tivi" : (query.nhom == "mobile") ? "mobile" : "food"
            db.getAll(collection).then((result) => {
                let ds = []
                result.forEach(item => {
                    let obj = {
                        "Ma_so": item.Ma_so,
                        "Ten": item.Ten,
                        "Phieudat": []
                    }
                    if (item.Danh_sach_Phieu_Dat.length > 0) {
                        let dsPhieu = item.Danh_sach_Phieu_Dat.filter(p => p.Trang_thai == "CHUA_GIAO_HANG");
                        if(dsPhieu) {
                            dsPhieu.forEach(x => {
                                obj.Phieudat.push(x);
                            })
                        }
                        let dsDangxuly = item.Danh_sach_Phieu_Dat.filter(p => p.Trang_thai == "DANG_XU_LY");
                        if(dsDangxuly) {
                            dsDangxuly.forEach(x => {
                                obj.Phieudat.push(x);
                            })
                        }
                        let dsDangVanchuyen = item.Danh_sach_Phieu_Dat.filter(p => p.Trang_thai == "DANG_VAN_CHUYEN");
                        if (dsDangxuly) {
                            dsDangVanchuyen.forEach(x => {
                                obj.Phieudat.push(x);
                            })
                        }
                        let dsDagiao = item.Danh_sach_Phieu_Dat.filter(p => p.Trang_thai == "DA_GIAO_HANG");
                        if (dsDangxuly) {
                            dsDagiao.forEach(x => {
                                obj.Phieudat.push(x);
                            })
                        }
                        
                    }
                    if (obj.Phieudat.length > 0) {
                        ds.push(obj)
                    }

                })
                ket_qua = JSON.stringify(ds);
                res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" })
                res.end(ket_qua);
            }).catch((err) => console.log(err));
        } else if (url == "/Cuahang") {
            if (!query.Ma_so) {
                db.getAll("store").then((result) => {
                    ket_qua = JSON.stringify(result);
                    res.end(ket_qua);
                }).catch((err) => console.log(err));

            } else {
                console.log(query.Ma_so);
                let filter = {
                    "Ma_so": param.query.Ma_so
                }
                console.log(filter);
                db.getOne("store", filter).then(result => {
                    ket_qua = JSON.stringify(result);
                    res.end(ket_qua);
                }).catch((err) => console.log(err));
            }
        } else if (url == "/dsHocsinh") {
            if (!query.Ma_so) {
                db.getAll("student").then((result) => {
                    ket_qua = JSON.stringify(result);
                    res.end(ket_qua);
                }).catch((err) => console.log(err));

            } else {
                console.log(query.Ma_so);
                let filter = {
                    "Ma_so": param.query.Ma_so
                }
                console.log(filter);
                db.getOne("student", filter).then(result => {
                    ket_qua = JSON.stringify(result);
                    res.end(ket_qua);
                }).catch((err) => console.log(err));
            }
        } else if (url == "/dsNguoidung") {
            if (!query.Ma_so) {
                db.getAll("users").then((result) => {
                    console.log(result);
                    ket_qua = JSON.stringify(result);
                    res.end(ket_qua);
                }).catch((err) => console.log(err));

            } else {
                console.log(query.Ma_so);
                let filter = {
                    "Ma_so": param.query.Ma_so
                }
                console.log(filter);
                db.getOne("student", filter).then(result => {
                    ket_qua = JSON.stringify(result);
                    res.end(ket_qua);
                }).catch((err) => console.log(err));
            }
        } else if (url.match("\.png$")) {
            let imagePath = `images/${url}`;
            if (!fs.existsSync(imagePath)) {
                imagePath = `images/noImage.png`;
            }
            let fileStream = fs.createReadStream(imagePath);
            res.writeHead(200, { "Content-Type": "image/png" });
            fileStream.pipe(res);

        } else {
            ket_qua = `Method: ${method} - Url: ${url} - Error`;
            res.end(ket_qua);
        }


    } else if (method == "POST") {
        // Nhận Tham số từ Client gởi về
        let noi_dung_nhan = '';
        req.on("data", (data) => {
            noi_dung_nhan += data

        })
        //Xử lý tính năng đăng nhập
        if (url == "/Dangnhap") {
            req.on("end", () => {
                let ket_qua = {
                    "Noi_dung": true
                }
                let user = JSON.parse(noi_dung_nhan);
                console.log(user);
                let dieukien = {
                    $and: [
                        { "Ten_Dang_nhap": user.Ten_Dang_nhap },
                        { "Mat_khau": user.Mat_khau }
                    ]
                }
                db.getOne("users", dieukien).then(result => {
                    if (result) {
                        libToken.generateAccessToken(result).then(key => {
                            let token = {
                                "Ho_ten": result.Ho_ten,
                                "Nhom": {
                                    "Ma_so": result.Nhom_Nguoi_dung.Ma_so,
                                    "Ten": result.Nhom_Nguoi_dung.Ten
                                },
                                "access_token": key
                            }
                            console.log(token);
                            res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                            res.end(JSON.stringify(token));
                        })
                    } else {
                        ket_qua.Noi_dung = false;
                    }

                }).catch(err => {
                    console.log(err);
                    ket_qua.Noi_dung = false;
                    res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                    res.end(JSON.stringify(ket_qua));
                })
            })
        }

        // Xử lý Tham số, trả kết quả về cho client
        else if (url == "/ThemNguoidung") {
            req.on("end", () => {
                db.insertOne("users", JSON.parse(noi_dung_nhan)).then((result) => {
                    console.log(result);
                    ket_qua = JSON.stringify(result);
                    res.end(ket_qua)
                }).catch(err => console.log(err));
            })
        } else if (url == "/SuaNguoidung") {
            req.on("end", () => {

                let nguoiDung = JSON.parse(noi_dung_nhan);


                db.updateOne("users", nguoiDung.condition, nguoiDung.update).then((result) => {
                    ket_qua = JSON.stringify(result);
                    res.end(ket_qua);
                }).catch(err => console.log(err));

            })
        } else if (url == "/XoaNguoidung") {
            req.on("end", () => {
                let nguoiDung = JSON.parse(noi_dung_nhan);
                let filter = {
                    "Ma_so": nguoiDung.Ma_so
                }
                db.deleteOne("users", filter).then((result) => {
                    ket_qua = JSON.stringify(result);
                    res.end(ket_qua);
                }).catch(err => console.log(err));
            })
        }//Xử lý crud api cho tivi
        else if (url == "/ThemTivi") {
            req.on("end", () => {
                db.insertOne("tivi", JSON.parse(noi_dung_nhan)).then((result) => {
                    console.log(result);
                    ket_qua = JSON.stringify(result);
                    res.end(ket_qua)
                }).catch(err => console.log(err));
            })
        } else if (url == "/SuaTivi") {
            req.on("end", () => {

                let tivi = JSON.parse(noi_dung_nhan);


                db.updateOne("tivi", tivi.condition, tivi.update).then((result) => {
                    ket_qua = JSON.stringify(result);
                    res.end(ket_qua);
                }).catch(err => console.log(err));

            })
        } else if (url == "/XoaTivi") {
            req.on("end", () => {
                let tivi = JSON.parse(noi_dung_nhan);
                let filter = {
                    "Ma_so": tivi.Ma_so
                }
                db.deleteOne("tivi", filter).then((result) => {
                    ket_qua = JSON.stringify(result);
                    res.end(ket_qua);
                }).catch(err => console.log(err));
            })
        }
        //Xử lý api mặt hàng
        else if (url == "/ThemMathang") {
            req.on("end", () => {
                db.insertOne("food", JSON.parse(noi_dung_nhan)).then((result) => {
                    console.log(result);
                    ket_qua = JSON.stringify(result);
                    res.end(ket_qua)
                }).catch(err => console.log(err));
            })
        } else if (url == "/SuaMathang") {
            req.on("end", () => {

                let food = JSON.parse(noi_dung_nhan);


                db.updateOne("food", food.condition, food.update).then((result) => {
                    ket_qua = JSON.stringify(result);
                    res.end(ket_qua);
                }).catch(err => console.log(err));

            })
        } else if (url == "/XoaMathang") {
            req.on("end", () => {
                let food = JSON.parse(noi_dung_nhan);
                let filter = {
                    "Ma_so": food.Ma_so
                }
                db.deleteOne("food", filter).then((result) => {
                    ket_qua = JSON.stringify(result);
                    res.end(ket_qua);
                }).catch(err => console.log(err));
            })
        }
         else if (url == "/SMS") {
            req.on("end", () => {
                let ket_qua = { "Noi_dung": true };
                let so_dien_thoai = `+84708375980`
                let noi_dung = `Test SMS From Service javaScript`
                sms.Goi_Tin_nhan(so_dien_thoai, noi_dung).then(result => {
                    console.log(result)
                    res.end(JSON.stringify(ket_qua))
                }).catch(err => {
                    console.log(err);
                    ket_qua.Noi_dung = false;
                    res.end(JSON.stringify(ket_qua));
                })
            })
        } else if (url == "/Lienhe") {
            req.on("end", function () {
                let thongTin = JSON.parse(noi_dung_nhan);
                let Ket_qua = { "Noi_dung": true };
                let from = thongTin.email;
                let to = `trongnhan8150@gmail.com`;
                let subject = thongTin.tieude;
                let body = `Name: ${thongTin.name} <br/> Email: ${thongTin.email} <br/> ${thongTin.noidung}`
                sendMail.Goi_Thu_Lien_he(from, to, subject, body).then(result => {
                    console.log(result)
                    res.end(JSON.stringify(Ket_qua));
                }).catch(err => {
                    console.log(err);
                    Ket_qua.Noi_dung = false;
                    res.end(JSON.stringify(Ket_qua));
                })
            })
        } else if (url == "/Dathang") {
            req.on("end", () => {
                let dsDathang = JSON.parse(noi_dung_nhan);

                let ket_qua = { "Noi_dung": [] };
                dsDathang.forEach(item => {
                    // console.log(item);
                    let filter = {
                        "Ma_so": item.key
                    }
                    let collectionName = (item.manhom == 1) ? "tivi" : (item.manhom == 2) ? "food" : "mobile";
                    db.getOne(collectionName, filter).then(result => {
                        console.log(result);
                        item.dathang.So_Phieu_Dat = result.Danh_sach_Phieu_Dat.length + 1;
                        result.Danh_sach_Phieu_Dat.push(item.dathang);
                        // Update
                        let capnhat = {
                            $set: { Danh_sach_Phieu_Dat: result.Danh_sach_Phieu_Dat }
                        }
                        let obj = {
                            "Ma_so": result.Ma_so,
                            "Update": true
                        }
                        db.updateOne(collectionName, filter, capnhat).then(result => {
                            if (result.modifiedCount == 0) {
                                obj.Update = false
                            }
                            ket_qua.Noi_dung.push(obj);
                            console.log(ket_qua.Noi_dung)
                            if (ket_qua.Noi_dung.length == dsDathang.length) {
                                res.end(JSON.stringify(ket_qua));
                            }
                        }).catch(err => {
                            console.log(err)
                        })
                    }).catch(err => {
                        console.log(err);
                    })

                })
            })
        }
        //Xử lý cập nhật trạng thái
        else if (url == "/capNhatTrangthai") {
            req.on("end", () => {
                let trangthaimoi = JSON.parse(noi_dung_nhan);
                let ket_qua = { "Noi_dung": [] };
                let filter = {
                    "Ma_so" : trangthaimoi.maso
                }
                let collection = (trangthaimoi.nhom == 1) ? "tivi" : (trangthaimoi.nhom == 2) ? "mobile" : "food";
                db.getOne(collection,filter).then(result => {
                    if(result.Danh_sach_Phieu_Dat.length > 0) {
                        let vtPhieuDat = result.Danh_sach_Phieu_Dat.findIndex(x => x.Ma_so == trangthaimoi.masoPhieu);
                        if(vtPhieuDat != -1) {
                            result.Danh_sach_Phieu_Dat[vtPhieuDat].Trang_thai = trangthaimoi.trangthai;
                        }
                    }
                    console.log(result);
                    //update 
                    let capnhat = {
                        $set : {
                            Danh_sach_Phieu_Dat: result.Danh_sach_Phieu_Dat
                        }
                    }
                    db.updateOne(collection,filter, capnhat).then(result => {
                        console.log(result);
                        if (result.modifiedCount == 1) {
                            ket_qua.Noi_dung = true;
                            res.end(JSON.stringify(ket_qua));
                        }
                    }).catch(err => {
                        console.log(err)
                    })
                }).catch(err => {
                    console.log(err);
                })

                
            })
        }

        else if (url == "/ThemDienthoai") {
            req.on('end', function () {
                //Chứng thực token
                const accessToken = req.headers['authorization']
                console.log(accessToken)
                libToken.verifyToken(accessToken).then(result => {
                    console.log(result);
                    if (result.Nhom_Nguoi_dung.Ma_so == "NHAN_VIEN_NHAP_HANG") {
                        let mobile = JSON.parse(noi_dung_nhan);
                        let ket_qua = { "Noi_dung": true };
                        db.insertOne("mobile", mobile).then(result => {
                            console.log(result);
                            res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                            res.end(JSON.stringify(ket_qua));
                        }).catch(err => {
                            console.log(err);
                            ket_qua.Noi_dung = false;
                            res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                            res.end(JSON.stringify(ket_qua));
                        })
                    } else {
                        ket_qua.Noi_dung = false;
                        res.end(JSON.stringify(ket_qua))
                    }
                })
                
            })
        }
        else if (url == "/SuaDienthoai") {
            req.on('end', function () {
                //Chứng thực token
                const accessToken = req.headers['authorization']
                console.log(accessToken)
                libToken.verifyToken(accessToken).then(result => {
                    if (result.Nhom_Nguoi_dung.Ma_so == "NHAN_VIEN_NHAP_HANG") {
                        let mobile = JSON.parse(noi_dung_nhan);
                        let ket_qua = { "Noi_dung": true };
                        db.updateOne("mobile", mobile.condition, mobile.update).then(result => {
                            console.log(result);
                            res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                            res.end(JSON.stringify(ket_qua));
                        }).catch(err => {
                            console.log(err);
                            ket_qua.Noi_dung = false;
                            res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                            res.end(JSON.stringify(ket_qua))
                        })

                    } else {
                        ket_qua.Noi_dung = false;
                        res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                        res.end(JSON.stringify(ket_qua))
                    }
                })
            })
        }
        else if (url == "/XoaDienthoai") {
            req.on('end', function () {
                //Chứng thực token
                const accessToken = req.headers['authorization']
                console.log(accessToken)
                libToken.verifyToken(accessToken).then(result => {
                    if (result.Nhom_Nguoi_dung.Ma_so == "NHAN_VIEN_NHAP_HANG") {
                        let mobile = JSON.parse(noi_dung_nhan);
                        let ket_qua = { "Noi_dung": true };
                        db.deleteOne("mobile", mobile).then(result => {
                            console.log(result);
                            res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                            res.end(JSON.stringify(ket_qua));
                        }).catch(err => {
                            console.log(err);
                            ket_qua.Noi_dung = false;
                            res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                            res.end(JSON.stringify(ket_qua))
                        })

                    } else {
                        ket_qua.Noi_dung = false;
                        res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                        res.end(JSON.stringify(ket_qua))
                    }
                })

            })

        }

        else if (url == "/ImagesDienthoai") {
            req.on('end', function () {
                let img = JSON.parse(noi_dung_nhan);
                let Ket_qua = { "Noi_dung": true };
                // upload img in images ------------------------------

                // let kq = saveMedia(img.name, img.src)
                // if (kq == "OK") {
                //     res.writeHead(200, { "Content-Type": "text/json; charset=utf-8" });
                //     res.end(JSON.stringify(Ket_qua));
                // } else {
                //     Ket_qua.Noi_dung = false
                //     res.writeHead(200, { "Content-Type": "text/json; charset=utf-8" });
                //     res.end(JSON.stringify(Ket_qua));
                // }

                // upload img host cloudinary ------------------------------

                imgCloud.UPLOAD_CLOUDINARY(img.name, img.src).then(result => {
                    console.log(result);
                    res.end(JSON.stringify(Ket_qua));

                }).catch(err => {
                    Ket_qua.Noi_dung = false
                    res.end(JSON.stringify(Ket_qua))
                })

            })

        }




    } else {
        res.end(ket_qua);
    }
})

// Upload Media -----------------------------------------------------------------
function decodeBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};

    if (matches.length !== 3) {
        return new Error('Error ...');
    }

    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');

    return response;
}

function saveMedia(Ten, Chuoi_nhi_phan) {
    var Kq = "OK"
    try {
        var Nhi_phan = decodeBase64Image(Chuoi_nhi_phan);
        var Duong_dan = "images//" + Ten
        fs.writeFileSync(Duong_dan, Nhi_phan.data);
    } catch (Loi) {
        Kq = Loi.toString()
    }
    return Kq
}




dich_vu.listen(port, () => {
    console.log(`Server http://localhost:${port} run ....`)
})