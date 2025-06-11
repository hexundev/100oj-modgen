$(document).ready(function () {
  var modData = {
    ModDefinition: {
      name: "",
      description: "",
      author: "",
      system_version: 2,
      changelog: "",
      mod_version: "",
      color: "#ffbc5e",
      contest: false
    },

    ModReplacements: {
      textures: [],
      pets: [],
      music: [],
      voices: {
        character: [],
        system: []
      },
      hair_color: [],
      sound_effects: []
    }
  };

  var modJSON = JSON.stringify(modData);

  function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {
      type: contentType
    });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  }

  function readFile(path, onLoad) {
    var fr = new FileReader();
    fr.onload = function () {
      onLoad(fr.result);
    };
    fr.readAsText(path);
  }

  function loadLegacyMod(text) {
    if (text == undefined || text.trim().length == 0) {
      alert('Invalid legacy mod file.');
      return;
    }

    let data = {}
    let lines = text.trim().split(/\r?\n/)

    while (lines.length > 0) {
      if (lines[0].trim() == "") {
        lines.shift()
        continue
      }

      let header = readLegacyHeader(lines)
      if (header == undefined) {
        alert('Invalid legacy mod file.');
        return;
      }

      let content = readLegacyValues(lines)
      data[header] = content
    }

    if (!tv4.validate(data, legacyModSchema, false, true)) {
      alert('Invalid legacy mod file.');
      return;
    }
    
    let mod = JSON.parse(modJSON)
    mod.ModDefinition.name = data["MOD_NAME"][0]
    mod.ModDefinition.author = data["MOD_AUTHOR"][0]
    mod.ModDefinition.description = data["MOD_DESCRIPTION"][0]
    mod.ModReplacements.textures = data["MOD_REPLACEMENTS"]
    loadModData(mod)
  }

  function readLegacyHeader(lines) {
    let pattern = /^< ([A-Z_]+) >$/
    let header
    let line = lines.shift()
    if (line != undefined && (header = line.trim().match(pattern)[1]) == null) {
      return undefined
    }
    return header
  }

  function readLegacyValues(lines) {
    let value = []
    let line = lines.shift()
    while (line != undefined && line.trim() != "") {
      value.push(line.trim())
      line = lines.shift()
    }
    return value
  }

  function loadModData(data) {
    if (!tv4.validate(data, modSchema, false, true)) {
      alert('Invalid mod file.');
      return;
    }

    // Copy mod definitions
    modData.ModDefinition.name = data.ModDefinition.name
    modData.ModDefinition.author = data.ModDefinition.author
    modData.ModDefinition.description = data.ModDefinition.description
    modData.ModDefinition.changelog = data.ModDefinition.changelog || ""
    modData.ModDefinition.contest = data.ModDefinition.contest || false
    modData.ModDefinition.color = data.ModDefinition.color || "#ffbc5e"

    // Copy mod replacements
    modData.ModReplacements.textures = (data.ModReplacements || {}).textures || []
    modData.ModReplacements.pets = (data.ModReplacements || {}).pets || []
    modData.ModReplacements.music = (data.ModReplacements || {}).music || []
    modData.ModReplacements.voices = (data.ModReplacements || {}).voices || {}
    modData.ModReplacements.voices.system = ((data.ModReplacements || {}).voices || {}).system || []
    modData.ModReplacements.voices.character = ((data.ModReplacements || {}).voices || {}).character || []
    modData.ModReplacements.sound_effects = (data.ModReplacements || {}).sound_effects || [];
    modData.ModReplacements.hair_color = (data.ModReplacements || {}).hair_color || [];
    
    updateForm()

    // Update output
    updateResult();
  };

  function showError(elem, err) {
    if (err == undefined || err.length == 0) {
      $(elem).hide();
    } else {
      $(elem).show();
      $(elem).html(err);
    }
  }

  function numberOrDefault(value, defaultValue) {
    if (value == "") {
      return defaultValue;
    }
    return Number(value);
  }
  
  // Copy mod definition to form
  function updateForm() {
    $('#form-modinfo-name').val(modData.ModDefinition.name);
    $('#form-modinfo-description').val(modData.ModDefinition.description);
    $('#form-modinfo-author').val(modData.ModDefinition.author);
    $('#form-modinfo-changelog').val(modData.ModDefinition.changelog);
    $('#form-modinfo-contest').prop('checked', modData.ModDefinition.contest);
    $('#form-modinfo-color').val(modData.ModDefinition.color);
  }

  // Copy mod definition from form
  function updateDefinition(def) {
    def.name = $('#form-modinfo-name').val();
    def.description = $('#form-modinfo-description').val();
    def.author = $('#form-modinfo-author').val();
    def.changelog = $('#form-modinfo-changelog').val();
    def.contest = $('#form-modinfo-contest').prop('checked');
    def.color = $('#form-modinfo-color').val();
  };

  function updateResult() {
    updateDefinition(modData.ModDefinition);

    var text = JSON.stringify(modData, null, ' ');
    $("#json-result").html(text);
  }

  function updateReplacedTextures() {
    return;

    var text = '';
    modData.ModReplacements.textures.forEach(t => {
      text += '-';
      if (isTextureObj(t)) {
        text += t.path + ' (Adv.)';
      } else {
        text += t;
      }
      text += '<br>';
    });

    $("#form-modrep-textures").html(text);
  }

  function isTextureObj(tex) {
    return tex != undefined && (typeof tex === 'object');
  }

  // Textures can be a string or object
  function getTextureIndex(tex) {
    var path = tex
    if (isTextureObj(tex)) {
      path = tex.path
    }
    var index = modData.ModReplacements.textures.findIndex(t => {
      // Compare path
      if (isTextureObj(t)) {
        return t.path == tex.path;
      }
      // Compare name
      return path == t;
    });
    return index;
  }

  // Events
  $('#b-loadjson').click(function () {
    $('#file-json').trigger('click');
  });

  $('#b-loadtxt').click(function () {
    $('#file-txt').trigger('click');
  });

  $('#b-reset').click(function () {
    $('form').each(function (i, form) {
      form.reset()
    })
    modData = JSON.parse(modJSON)
    updateResult()
  });

  $("#file-json").change(function () {
    var files = $("#file-json").prop('files');
    if (!files || files.length == 0) {
      return;
    }

    readFile(files[0], function (result) {
      try {
        loadModData(JSON.parse(result));
      } catch (e) {
        alert("Could not load JSON file.")
      }
    });
  });

  $("#file-txt").change(function () {
    var files = $("#file-txt").prop('files');
    if (!files || files.length == 0) {
      return;
    }

    readFile(files[0], function (result) {
      loadLegacyMod(result);
    });
  });

  // TODO: Replace?
  $("#b-update").click(function () {
    updateResult();
  });

  $("#b-savejson").click(function () {
    updateResult();

    var text = JSON.stringify(modData, null, 2);
    download(text, 'mod.json', 'application/json');
  });

  $("form").onsubmit = (function () {
    console.log("owo");
    return false;
  });

  $("#b-addtexture").click(function () {
    var path = $("#form-texadv-path").val()
    if (path.length <= 0) {
      return
    }

    var isAdv = $("#cb-textadv-opts").prop("checked")
    var isUnit = $("#r-tex-type-unit").prop("checked")
    var isCard = $("#r-tex-type-card").prop("checked")

    switch (true) {
      case isAdv && isUnit:
        tex = {
          path: path,
          face_x: Number($("#form-texadv-facex").val()),
          face_y: Number($("#form-texadv-facey").val()),
          costume_id: Number($("#form-texadv-costumeid").val()),
          single_file: $("#form-texadv-singlefile").prop("checked")
        }
        break
      case isAdv && isCard:
        tex = {
          path: path,
          custom_name: $("#form-texadv-cardname").val(),
          custom_flavor: $("#form-texadv-cardflavor").val()
        }
        break
      default:
        tex = path
    }

    // Overwrite if it exits
    var index = getTextureIndex(tex)
    if (index != -1) {
      modData.ModReplacements.textures[index] = tex
    } else {
      modData.ModReplacements.textures.push(tex)
    }

    updateResult()
    $("#s-modrep-textures form").get(0).reset()
  });

  $("#b-addmusic").click(function () {
    var path = $("#form-music-file").val()
    if (path.length <= 0) {
      return
    }
    
    var obj = {
      file: path,
      unit_id: $("#form-music-unit").val(),
      loop_point: Number($("#form-music-loop").val()),
      volume: numberOrDefault($("#form-music-volume").val(), 0.0)
    };

    // Overwrite if it exists
    var index = modData.ModReplacements.music.findIndex(function (value) {
      return value.unit_id != undefined && value.unit_id == obj.unit_id;
    });

    if (index != -1) {
      modData.ModReplacements.music[index] = obj;
    } else {
      modData.ModReplacements.music.push(obj);
    }

    updateResult();
    $("#s-modrep-music-cha form").get(0).reset()
  });

  $("#b-addeventmusic").click(function () {
    var path = $("#form-eventmusic-file").val()
    if (path.length <= 0) {
      return
    }

    var obj = {
      file: path,
      event: $("#form-eventmusic-event").val(),
      loop_point: Number($("#form-eventmusic-loop").val()),
      volume: numberOrDefault($("#form-eventmusic-volume").val(), 0.0)
    };

    // Overwrite if it exists
    var index = modData.ModReplacements.music.findIndex(function (value) {
      return value.event != undefined && value.event == obj.event;
    });

    if (index != -1) {
      modData.ModReplacements.music[index] = obj;
    } else {
      modData.ModReplacements.music.push(obj);
    }

    updateResult();
    $("#s-modrep-music-ev form").get(0).reset()
  });

  $("#b-addvoice-character").click(function () {
    var voice = $("#form-modrep-voice-chara").val().toLowerCase()
    if (voice.length <= 0) {
      return
    }

    if (!modData.ModReplacements.voices.character.includes(voice)) {
      modData.ModReplacements.voices.character.push(voice);
    }

    $("#form-modrep-voice-chara").val("");
    updateResult();
  });

  $("#b-addvoice-sys").click(function () {
    var voice = $("#form-modrep-voice-sys").val().toLowerCase();
    if (voice.length <= 0) {
      return
    }

    if (!modData.ModReplacements.voices.system.includes(voice)) {
      modData.ModReplacements.voices.system.push(voice);
    }

    $("#form-modrep-voice-sys").val("");
    updateResult();
  });

  $("#b-addsound").click(function () {
    var sound = $("#form-modrep-sound").val().toLowerCase()
    if (sound.length <= 0) {
      return
    }
    
    if (!sound.includes(".wav")) {
      sound += ".wav";
    }

    if (!modData.ModReplacements.sound_effects.includes(sound)) {
      modData.ModReplacements.sound_effects.push(sound);
    }

    $("#form-modrep-sound").val("");
    updateResult();
  });

  $("#b-addhair").click(function () {
    var obj = {
      unit_id: $("#form-hair-unit").val(),
      hair_color: Number($("#form-hair-haircolor").val()),
      technique: $("#form-hair-technique").val().toLowerCase().replace(' ', ''),
      base_color: $("#form-hair-base").val(),
      secondary_color: $("#form-hair-secondary").val(),
      shadow_color: $("#form-hair-shadow").val(),
      add_color: $("#form-hair-add").val()
    };

    // Overwrite if it exits
    // Also check if it's the same hair color ID
    var index = modData.ModReplacements.hair_color.findIndex(function (value) {
      return (value.unit_id == obj.unit_id) && (value.hair_color == obj.hair_color);
    });

    if (index != -1) {
      modData.ModReplacements.hair_color[index] = obj;
    } else {
      modData.ModReplacements.hair_color.push(obj);
    }

    updateResult();
  });

  function addHairColorOptions() {
    var list = $("#form-hair-haircolor");
    for (var i = 1; i <= hairColors; ++i) {
      list.append("<option>" + i + "</option>");
    }
  }

  function addUnitOptions() {
    var lists = [
      $("#form-music-unit"),
      $("#form-hair-unit")
    ];

    lists.forEach(list => {
      unitNames.forEach(name =>
        list.append("<option>" + name + "</option>"));
    });
  }

  function addMusicOptions() {
    var list = $("#form-eventmusic-event");
    eventMusicNames.forEach(music =>
      list.append("<option>" + music + "</option>"));
  }

  function addCostumeOptions() {
    var list = $("#form-texadv-costumeid");
    for (var i = 0; i <= costumeIds; ++i) {
      list.append("<option>" + i + "</option>");
    }
  }

  // Add options to select elements 
  addHairColorOptions();
  addUnitOptions();
  addMusicOptions();
  addCostumeOptions();

  updateResult();
});