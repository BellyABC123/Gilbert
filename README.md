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
Notice that we defined our class as "UITextField" in this example. If you know you are going to target Objective-C, you can just give the class name you want directly and the parser will handle it accordingly. Also notice that the `clearsOnBeginEditing` value is `true`. For properties that take `BOOL` values, we provide it with the JSON equivalent and the parser will take care of conversion.

###HTML / CSS###
```
height
margin (can be specific: topMargin, rightMargin, bottomMargin, leftMargin)
padding (can be specific: topPadding, rightPadding, bottomPadding, leftPadding)
boxShadowColor
boxShadowOffset
textShadowColor
textShadowOffset
width
```

