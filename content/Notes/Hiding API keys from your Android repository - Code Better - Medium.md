---
title: Hiding API keys from your Android repository
description: How to avoid checking API keys into your source control.
date: 2020-06-06
draft: true
---

Let’s say that you are building a nice app, one that connects to a third-party service. Almost any API worth implementing uses an API key as part of basic authentication and security. Checking this into source control can expose your key to the public if you ever open-source your project (or parts of it).

The Gradle build system allows us a clean way to avoid this.

1. Add the key to your `gradle.properties` file in your home directory under `.gradle` directory.
2. Import the key as a `buildConfigField` / `resValue` in your module-level `build.gradle` file.
3. Use the key in your Java or XML files as needed.

# 1. Defining key in `build.gradle`

Find the `.gradle` folder in your home directory. Usually it can be found at:

- **Windows:** `C:\Users\<Your Username>\.gradle`
- **Mac:** `/Users/<Your Username>/.gradle`
- **Linux:** `/home/<Your Username>/.gradle`

Inside it there would be a file named `gradle.properties` (just create it if there isn’t any).

After that, add your key to the file as a property. If your key was `my-awesome-api-key`, the file after adding the key might look something like:

```
MyAwesomeApp_ApiKey="my-awesome-api-key"
```

I prefer to use this format `<Project Name>_<Key Property Name>` so that I don’t mix up keys for different projects by mistake.

# 2. Importing the key in your project

- Open your module-level `build.gradle` file (usually the one where you define dependencies for your app).
- Add your property in each of your build types.
- If you want to access the key from Java, then add it as a `buildConfigField`.
- If you want to access the key in your XML files (layouts and other resources), then add it as a `resValue`.

After doing so, your `build.gradle` might look like this:

```
buildTypes { debug { buildConfigField 'String', "ApiKey", MyAwesomeApp_ApiKey resValue 'string', "api_key", MyAwesomeApp_ApiKey } release { minifyEnabled false proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro' buildConfigField 'String', "ApiKey", MyAwesomeApp_ApiKey resValue 'string', "api_key", MyAwesomeApp_ApiKey }}
```

# 3. Using the key in your app’s code

Now you can access the key from your code as described below.

## Accessing in Java

It is available as a standard String in your Java/Kotlin (if you use Kotlin, you good sir just became a friend of mine) code. To access it:

```
// Java...String apiKey = BuildConfig.ApiKey;...// Kotlin...val apiKey: String = BuildConfig.ApiKey...
```

## Accessing in XML

If you want to use it in XML files (like AdMob keys are needed sometimes in XML), you can access them just like any other string resource (used in the last line):

```
http://schemas.android.com/apk/res-auto@string/
```

Now you can safely have a public repository that can reference API keys. You can also have different keys for debug and release (just specify different property names in respective build-types).

## Being a good samaritan

Securing your API keys is an essential step and you should always do it, but you also should document how someone is supposed to provide those keys to build the project from a clean checkout from your repository.

If you know of a better way for this comment below or tweet to me [@varun_barad](https://twitter.com/varun_barad). You can even send me ideas for any other topics that you would like to know about.