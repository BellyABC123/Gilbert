#Gilbert App#

##Purpose##
[Gilbert](http://gilbertapp.herokuapp.com) is your personal assistant when it comes to creating views for mobile devices. By writing some simple JSON, you can generate code that renders the describe view in native iOS and HTML / CSS. 

##Example##
To add something like a label to a view, we could do the following:
```
  {
    "myLabel" : {
      "class" : "label",
      "backgroundColor" : "clear",
      "text" : "My Label",
      "textColor" : "blue",
      "font" : "Helvetica",
      "fontSize" : 18
    }
  }
```

In the above example, only the Objective-C parser will use the "class" key. Since each language has specific attributes, the parser will handle the keys accordingly. For example the "clear" color keyword will translate to `[UIColor clearColor]` in Objective-C and `transparent` in CSS.

##Supported Keywords##

###Both###

####Keys####
```
align
backgroundColor
backgroundImage
font
fontSize
text
textAlignment
textColor
```

####Colors####
You can use any hexcode value or one of the predefined colors below:

+ `red`
+ `orange`
+ `yellow`
+ `green`
+ `blue`
+ `purple`
+ `brown`
+ `black`
+ `gray`
+ `lightGray`
+ `darkGray`
+ `white`
+ `magenta`
+ `cyan`
+ `magenta`
+ `clear`

###Objective-C###
```
class
relativeTo ("window")
self (key)
class-specific properties
```
####Class-specific properties####

The parser will include calls to set class-specific properties. For example, if we had a UITextField, we could set different properties on it by defining which properties will be set, and then using those property names as keys. For example,

```
{
  "myTextField" : {
    "class" : "UITextField",
    "properties" : ["placeholder", "clearsOnBeginEditing"],
    "placeholder" : "Placeholder Text",
    "clearsOnBeginEditing" : true
  }
}
```
Notice that we defined our class as "UITextField" in this example. If you know you are going to target Objective-C, you can just give the class name you want directly and the parser will handle it accordingly. Also notice that the clearsOnBeginEditing value is true. For properties that take BOOL values, we provide it with the JSON equivalent and the parser will take care of conversion.

####`self` keyword####

If the self key is set as a "subview" of the view being created, the parser handles this as a special case and allows the user to change view properties such as backgroundImage, backgroundColor, etc.

###HTML / CSS###
```
class (i.e. button, div, label/span, input/textfield, textarea)
height
margin (can be universal or specific: topMargin, rightMargin, bottomMargin, leftMargin)
padding (can be universal or specific: topPadding, rightPadding, bottomPadding, leftPadding)
boxShadowColor
boxShadowOffset
boxShadowBlur (optional)
textShadowColor
textShadowOffset
width
```
