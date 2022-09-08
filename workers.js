function got(url) {
  let html = null;
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      html = JSON.parse(xhttp.responseText).contents;
    }
  };
  xhttp.open("GET", "https://api.allorigins.win/get?url=" + url, false);
  xhttp.send();
  return html;
}

function removeElement(data, dom) {
  return data.forEach((a) => {
    dom.querySelectorAll(a).forEach((b) => {
      b.remove();
    });
  });
}

function isUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

function remakeUrlImage(dom, option) {
  try {
    let hostnameHref = new URL(option.url);
    dom.querySelectorAll(option.element).forEach((a) => {
      if (a.getAttribute("data-original") != null) {
        a.setAttribute(option.remake, a.getAttribute("data-original"));
      }
      if (a.getAttribute("data-src") != null) {
        a.setAttribute(option.remake, a.getAttribute("data-src"));
      }
      if (a.getAttribute("data-fallback") != null) {
        a.setAttribute(option.remake, a.getAttribute("data-fallback"));
      } else {
        let hrefAttr = a.getAttribute(option.target);
        if (hrefAttr == null) {
          if (a.getAttribute("data-src") != null) {
            a.setAttribute(option.remake, a.getAttribute("data-src"));
          }
        } else {
          if (hrefAttr.indexOf("//") == 0) {
          } else {
            if (isUrl(hrefAttr) == false) {
              if (hrefAttr.indexOf("#") == 0) {
                hrefAttr = "#";
              } else if (hrefAttr.indexOf("javascript") == 0) {
                hrefAttr = "#";
              } else if (hrefAttr.indexOf("/") == 0) {
                hrefAttr = hostnameHref + hrefAttr;
              } else {
                hrefAttr = hostnameHref + "/" + hrefAttr;
              }
            }
          }
          a.setAttribute(option.remake, hrefAttr);
        }
      }
      let _class = a.getAttribute("class");
      if (_class == null) {
      } else {
        if (_class.indexOf("lozad") > 0 || _class.indexOf("lozad") == 0) {
          _class = _class.replace("lozad", "");
        }

        if (_class.indexOf("fade") > 0 || _class.indexOf("fade") == 0) {
          _class = _class.replace("fade", "");
        }

        if (_class.indexOf("lazyload") > 1 || _class.indexOf("lazyload") == 0) {
          _class = _class.replace("lazyload", "");
        }
        a.setAttribute("class", _class);
      }

      a.setAttribute("loading", "lazy");
    });
  } catch (e) {
    // console.log(e);
  }
}

const host = window.location;
document.title = webTitle;
try {
  if (host.pathname == "/") {
    let html = got(target);
    if (html == null) {
      document.documentElement.innerHTML = "404";
    } else {
      let dom = new DOMParser();
      dom = dom.parseFromString(html, "text/html");
      removeElement(elementRemove, dom);

      dom.querySelectorAll("meta").forEach((a) => {
        if (a.getAttribute("property") == "og:url") {
          a.setAttribute("content", host.href);
        }
      });

      dom.querySelectorAll("link").forEach((a) => {
        let hrefAttr = a.getAttribute("href");
        if (hrefAttr == null) {
        } else {
          if (hrefAttr.indexOf("//") == 0) {
          } else {
            if (isUrl(hrefAttr) == false) {
              let hostnameHref = new URL(target);
              if (hrefAttr.indexOf("#") == 0) {
                hrefAttr = "#";
              } else if (hrefAttr.indexOf("javascript") == 0) {
                hrefAttr = "#";
              } else if (hrefAttr.indexOf("/") == 0) {
                hrefAttr = hostnameHref.origin + hrefAttr;
              } else {
                hrefAttr = hostnameHref.origin + "/" + hrefAttr;
              }
            }
          }
        }
        a.setAttribute("href", hrefAttr);

        if (a.getAttribute("rel") == "canonical") {
          a.setAttribute("href", host.href);
        }
      });

      dom.querySelectorAll("a").forEach((a) => {
        let hrefAttr = a.getAttribute("href");
        if (hrefAttr == null) {
        } else {
          if (hrefAttr.indexOf("//") == 0) {
          } else {
            if (isUrl(hrefAttr) == false) {
              let hostnameHref = new URL(target);
              if (hrefAttr.indexOf("#") == 0) {
                hrefAttr = "#";
              } else if (hrefAttr.indexOf("javascript") == 0) {
                hrefAttr = "#";
              } else if (hrefAttr.indexOf("/") == 0) {
                hrefAttr = hostnameHref.origin + hrefAttr;
              } else {
                hrefAttr = hostnameHref.origin + "/" + hrefAttr;
              }
            }

            let hostnameHref = new URL(target);
            if (hrefAttr.indexOf(hostnameHref.hostname) > 0) {
              hrefAttr = hrefAttr.split(hostnameHref.hostname)[1];
              hrefAttr = host.origin + hrefAttr;
            } else {
              if (isUrl(hrefAttr)) {
                hrefAttr = hrefAttr.replace("://", "-");
                hrefAttr = host.origin + "/host-" + hrefAttr;
              }
            }
          }
        }
        a.setAttribute("href", hrefAttr);
      });

      remakeUrlImage(dom, {
        element: "img",
        target: "src",
        remake: "src",
        url: target,
        permalink: "",
      });

      document.documentElement.remove();
      document.appendChild(dom.documentElement);

      let s = document.createElement("script");
      s.setAttribute("src", "/inject.js");
      s.setAttribute("type", "text/javascript");
      document.body.append(s);
    }
  } else if (host.pathname == "/gen-sitemap") {
    document.title = "Sitemap Generator - " + webTitle;
    document.body.innerHTML = "";
    var createElDom = document.createElement("div");
    (createElDom.id = "masjc"), document.body.append(createElDom);
    var createElStyle = document.createElement("style");
    (createElStyle.innerHTML =
      "button {\ncursor: pointer;\n padding: 5px 20px;\n background-color: blue; \n color: white;\n border-radius: 20px;\n }\n#masjc {\n    text-align: center;\n    padding: 10px 0;\n    z-index: 9999999;\n    position: fixed;\n    width: 100%;\n    height: 100%;\n    background-color: #fff;\n}\n#inKey {\n    width: 80%;\n    padding-left: 5px;\n    outline: none;\n    font-size: 15px;\n    height: 25px;\n    margin-bottom: 10px;\n}\n#getScrape {\n    cursor: pointer;\n    padding: 5px 20px;\n}\n#inKey {\n    width: 80%;\n    padding-left: 20px;\n    outline: none;\n    font-size: 15px;\n    height: 25px;\n    margin-bottom: 10px;\n    border-radius: 20px;\n}\n#outScrape {\n    margin: 10px 0;\n    width: 80%;\n    max-height: 150px;\n    height: 350px;\n    outline: none;\n    padding: 5px 10px;\n    border-radius: 5px;\n}\n#listUrl {\n    margin: 10px 0;\n    width: 80%;\n    max-height: 150px;\n    height: 350px;\n    outline: none;\n    padding: 5px 10px;\n    border-radius: 5px;\n}\n.countInfo {\n    margin-top: 10px;\n}\n.titleSoft {\n    padding: 10px 0;\n    font-size: 25px;\n    font-weight: bold;\n}\n.notifKey {\n    margin-top: 5px;\n}\n.bSetting {\n    text-align: right;\n    width: 80%;\n    margin: auto;\n}\n.cFooter {\n    width: max-content;\n    margin-left: 10%;\n    text-align: left;\n    position: absolute;\n    margin-top: -20px;\n}\n#bCopy, #mSave {\n    cursor: pointer;\n}\n"),
      document.head.append(createElStyle),
      (document.getElementById("masjc").innerHTML =
        '\n  <div class="titleSoft">Sitemap Generator</div>\n  <div>\n  <div class="countInfo">\n    <div>Nama File</div> </div> <input id="inKey" placeholder="sitemap.xml"/>\n  </div>\n <div>\n  <div class="countInfo">\n    <div>URL</div> </div>\n    <textarea id="listUrl" placeholder="http://url1\nhttp://url2\nhttp://url3\ndst..."></textarea>\n  </div> <div><button id="getScrape">Generate</button></div>\n  <div>\n    <textarea id="outScrape" readonly></textarea>\n  </div>\n  <div class="bSetting">\n    <button id="mSave">Save</button>\n    <button id="bCopy">Copy</button>\n  </div>\n  <div class="cFooter">Design By <a href="https://www.youtube.com/c/MasJc" target="_blank">@masjc</a></div>\n');

    document.getElementById("getScrape").addEventListener("click", function () {
      var namaFile = document.getElementById("inKey").value;
      if (namaFile == "") {
        namaFile = "sitemap.xml";
      } else if (namaFile.indexOf(".xml") < 0) {
        namaFile = namaFile + ".xml";
      }

      var listUrl = document.getElementById("listUrl").value;
      if (
        listUrl == "" ||
        listUrl == "\n" ||
        listUrl == "\n\n" ||
        listUrl == "\n\n\n"
      ) {
        alert("URL tidak boleh kosong");
      } else {
        let dataList = [];
        listUrl = listUrl.split("\n");
        for (let i in listUrl) {
          if (listUrl[i] != "") {
            dataList.push(listUrl[i]);
          }
        }

        let date = new Date(
          new Date().valueOf() - 1000 * 60 * 60
        ).toISOString();
        let res = document.getElementById("outScrape");
        res.value =
          '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.google.com/schemas/sitemap-image/1.1 http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
        dataList.forEach((a) => {
          if (isUrl(a)) {
            a = a.replace("://", "-");
          }
          res.value += `\n <url>\n  <loc>${host.origin}/host-${a}</loc>\n  <lastmod>${date}</lastmod>\n </url>`;
        });
        res.value += "\n</urlset>";
      }
    });

    document.getElementById("bCopy").addEventListener("click", function () {
      document.getElementById("outScrape").select(),
        document.execCommand("copy");
    }),
      document.getElementById("mSave").addEventListener("click", function () {
        var namaFile = document.getElementById("inKey").value;
        if (namaFile == "") {
          namaFile = "sitemap.xml";
        } else if (namaFile.indexOf(".xml") < 0) {
          namaFile = namaFile + ".xml";
        }
        var n = document.getElementById("outScrape").value,
          t = new Blob([n], { type: "text/xml" }),
          a = document.createElement("a");
        (a.download = namaFile),
          (a.href = window.URL.createObjectURL(t)),
          (a.target = "_blank"),
          (a.style.display = "none"),
          document.getElementById("masjc").appendChild(a),
          a.click(),
          document.getElementById("masjc").removeChild(a);
      });
  } else {
    try {
      if (host.href.indexOf("/host-") > 0) {
        let url = host.href.split("/host-")[1];
        url = url.replace("http-", "http://").replace("https-", "https://");
        if (url.indexOf(".xml") > 0) {
          document.title = webTitle;
          let xml = got(url);
          if (xml == null) {
            document.documentElement.innerHTML = "404";
          } else {
            let dom = new DOMParser();
            dom = dom.parseFromString(xml, "text/xml");
            if (dom.querySelector("loc") == null) {
              dom = new DOMParser();
              dom = dom.parseFromString(xml, "text/html");
              document.documentElement.remove();
              document.appendChild(dom.documentElement);
            } else {
              dom.querySelectorAll("loc").forEach((a) => {
                let hostnameHref = new URL(target);
                let d = a.textContent;
                if (d.indexOf(hostnameHref.hostname) > 0) {
                  d = d.split(hostnameHref)[1];
                  d = host.origin + "/" + d;
                } else {
                  d = d.replace("://", "-");
                  d = host.origin + "/host-" + d;
                }
                let ahref = document.createElement("a");
                ahref.setAttribute("href", d);
                ahref.innerHTML = d;
                document.body.append(ahref);
                document.body.append(document.createElement("br"));
              });
            }
          }
        } else {
          if (isUrl(url)) {
            let html = got(url);
            if (html == null) {
              document.documentElement.innerHTML = "404";
            } else {
              let dom = new DOMParser();
              dom = dom.parseFromString(html, "text/html");
              removeElement(elementRemove, dom);

              dom.querySelectorAll(".octo-loading").forEach((a) => {
                let cl = a.getAttribute("class");
                cl = cl.replace("octo-loading", "");
                a.setAttribute("class", cl);
              });

              dom.querySelectorAll("meta").forEach((a) => {
                if (a.getAttribute("property") == "og:url") {
                  a.setAttribute("content", host.href);
                }
              });

              dom.querySelectorAll("link").forEach((a) => {
                let hrefAttr = a.getAttribute("href");
                if (hrefAttr == null) {
                } else {
                  if (hrefAttr.indexOf("//") == 0) {
                  } else {
                    if (isUrl(hrefAttr) == false) {
                      let hostnameHref = new URL(url);
                      if (hrefAttr.indexOf("#") == 0) {
                        hrefAttr = "#";
                      } else if (hrefAttr.indexOf("javascript") == 0) {
                        hrefAttr = "#";
                      } else if (hrefAttr.indexOf("/") == 0) {
                        hrefAttr = hostnameHref.origin + hrefAttr;
                      } else {
                        hrefAttr = hostnameHref.origin + "/" + hrefAttr;
                      }
                    }
                  }
                }
                a.setAttribute("href", hrefAttr);

                if (a.getAttribute("rel") == "canonical") {
                  a.setAttribute("href", host.href);
                }
              });

              dom.querySelectorAll("a").forEach((a) => {
                let hrefAttr = a.getAttribute("href");
                if (hrefAttr == null) {
                } else {
                  if (hrefAttr.indexOf("//") == 0) {
                    let hostnameHref = new URL(url);
                    hrefAttr = hrefAttr.replace("//", "");
                    hrefAttr =
                      host.origin +
                      "/host-" +
                      hostnameHref.protocol.replace(":", "-") +
                      hrefAttr;
                  } else {
                    if (isUrl(hrefAttr) == false) {
                      let hostnameHref = new URL(url);
                      if (hrefAttr.indexOf("#") == 0) {
                        hrefAttr = "#";
                      } else if (hrefAttr.indexOf("javascript") == 0) {
                        hrefAttr = "#";
                      } else if (hrefAttr.indexOf("/") == 0) {
                        hrefAttr =
                          host.origin +
                          "/host-" +
                          hostnameHref.protocol.replace(":", "-") +
                          hostnameHref.hostname +
                          hrefAttr;
                      } else {
                        hrefAttr =
                          host.origin +
                          "/host-" +
                          hostnameHref.protocol.replace(":", "-") +
                          hostnameHref.hostname +
                          hrefAttr;
                      }
                    }

                    if (isUrl(hrefAttr)) {
                      if (hrefAttr.indexOf(host.hostname) > 0) {
                      } else {
                        hrefAttr = hrefAttr.replace("://", "-");
                        hrefAttr = host.origin + "/host-" + hrefAttr;
                      }
                    }
                  }
                }
                a.setAttribute("href", hrefAttr);
              });

              remakeUrlImage(dom, {
                element: "img",
                target: "src",
                remake: "src",
                url: url,
                permalink: "",
              });

              document.documentElement.remove();
              document.appendChild(dom.documentElement);

              let s = document.createElement("script");
              s.setAttribute("src", "/inject.js");
              s.setAttribute("type", "text/javascript");
              document.body.append(s);
            }
          } else {
            document.documentElement.innerHTML = "404";
          }
        }
      } else {
        let uri = host.href.split(host.origin)[1];
        if (isUrl(target + uri)) {
          target = target + uri;
          if (target.indexOf(".xml") > 0) {
            document.title = webTitle;
            let xml = got(target);
            let dom = new DOMParser();
            dom = dom.parseFromString(xml, "text/xml");
            dom.querySelectorAll("loc").forEach((a) => {
              let hostnameHref = new URL(target);
              let d = a.textContent;
              if (d.indexOf(hostnameHref.hostname) > 0) {
                d = d.split(hostnameHref.hostname)[1];
                d = host.origin + d;
                console.log(d);
              }
              let ahref = document.createElement("a");
              ahref.setAttribute("href", d);
              ahref.innerHTML = d;
              document.body.append(ahref);
              document.body.append(document.createElement("br"));
            });
          } else {
            let html = got(target);
            if (html == null) {
              document.documentElement.innerHTML = "404";
            } else {
              let dom = new DOMParser();
              dom = dom.parseFromString(html, "text/html");
              removeElement(elementRemove, dom);

              dom.querySelectorAll("meta").forEach((a) => {
                if (a.getAttribute("property") == "og:url") {
                  a.setAttribute("content", host.href);
                }
              });

              dom.querySelectorAll("link").forEach((a) => {
                let hrefAttr = a.getAttribute("href");
                if (hrefAttr == null) {
                } else {
                  if (hrefAttr.indexOf("//") == 0) {
                  } else {
                    if (isUrl(hrefAttr) == false) {
                      let hostnameHref = new URL(target);
                      if (hrefAttr.indexOf("#") == 0) {
                        hrefAttr = "#";
                      } else if (hrefAttr.indexOf("javascript") == 0) {
                        hrefAttr = "#";
                      } else if (hrefAttr.indexOf("/") == 0) {
                        hrefAttr = hostnameHref.origin + hrefAttr;
                      } else {
                        hrefAttr = hostnameHref.origin + "/" + hrefAttr;
                      }
                    }
                  }
                }
                a.setAttribute("href", hrefAttr);

                if (a.getAttribute("rel") == "canonical") {
                  a.setAttribute("href", host.href);
                }
              });

              dom.querySelectorAll("a").forEach((a) => {
                let hrefAttr = a.getAttribute("href");
                if (hrefAttr == null) {
                } else {
                  if (hrefAttr.indexOf("//") == 0) {
                  } else {
                    if (isUrl(hrefAttr) == false) {
                      let hostnameHref = new URL(target);
                      if (hrefAttr.indexOf("#") == 0) {
                        hrefAttr = "#";
                      } else if (hrefAttr.indexOf("javascript") == 0) {
                        hrefAttr = "#";
                      } else if (hrefAttr.indexOf("/") == 0) {
                        hrefAttr = hostnameHref.origin + hrefAttr;
                      } else {
                        hrefAttr = hostnameHref.origin + "/" + hrefAttr;
                      }
                    }

                    let hostnameHref = new URL(target);
                    if (hrefAttr.indexOf(hostnameHref.hostname) > 0) {
                      hrefAttr = hrefAttr.split(hostnameHref.hostname)[1];
                      hrefAttr = host.origin + hrefAttr;
                    } else {
                      if (isUrl(hrefAttr)) {
                        hrefAttr = hrefAttr.replace("://", "-");
                        hrefAttr = host.origin + "/host-" + hrefAttr;
                      }
                    }
                  }
                }
                a.setAttribute("href", hrefAttr);
              });

              remakeUrlImage(dom, {
                element: "img",
                target: "src",
                remake: "src",
                url: target,
                permalink: "",
              });

              document.documentElement.remove();
              document.appendChild(dom.documentElement);

              let s = document.createElement("script");
              s.setAttribute("src", "/inject.js");
              s.setAttribute("type", "text/javascript");
              document.body.append(s);
            }
          }
        } else {
          document.documentElement.innerHTML = "404";
        }
      }
    } catch (e) {
      //
    }
  }
} catch (e) {
  document.documentElement.innerHTML = "404";
}
