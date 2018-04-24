Hope this finds you well, future developer!

trying to keep this code well-commented, but so that you have a place to start:
+ familiarizing yourself with Next.js and its patterns (and `examples`) is gonna be a must-do
+ after that:
+ the project is structured like: page > apollo provider > redux provider > page wrapper component > contentful components
+ there is frequent use made of `DataManager` higher-order-components that allow a component to maintain its stateful / architectural code, while abstracting more data-oriented / helper-function-type code to a parent
  + sometimes there are many of these patterns nested inside one another
+ you can find these things in these places:
  + assets -> `/static`
  + apollo / redux / global helper functions / static data -> `/lib`
  + routing / route-data -> `/server`
  + top-lvl pages (routes) -> `/pages`
  + most everything else -> `/components`
+ 