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

      let s = dom.createElement("script");
      s.setAttribute("src", "/inject.js");
      dom.body.append(s);

      document.documentElement.remove();
      document.appendChild(dom.documentElement);
    }
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

              let s = dom.createElement("script");
              s.setAttribute("src", "/inject.js");
              dom.body.append(s);

              document.documentElement.remove();
              document.appendChild(dom.documentElement);
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

              let s = dom.createElement("script");
              s.setAttribute("src", "/inject.js");
              dom.body.append(s);

              document.documentElement.remove();
              document.appendChild(dom.documentElement);
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
