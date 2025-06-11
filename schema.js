const modSchema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "description": "100% Orange Juice Mod Schema",
    "type": "object",
    "properties": {
        "ModDefinition": {
            "$ref": "#/definitions/Definition"
        },
        "ModReplacements": {
            "$ref": "#/definitions/Replacements"
        }
    },
    "required": ["ModDefinition"],
    "definitions": {
        "Definition": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string",
                    "minLength": 1
                },
                "description": {
                    "type": "string",
                    "minLength": 1
                },
                "author": {
                    "type": "string",
                    "minLength": 1
                },
                "system_version": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 2
                },
                "changelog": {
                    "type": "string"
                },
                "mod_version": {
                    "type": "string"
                },
                "contest": {
                    "type": "boolean"
                },
                "color": {
                    "type": "string",
                    "pattern": "^#[a-fA-F0-9]{6}$"
                }
            },
            "required": ["name","description","author","system_version"]
        },
        "Replacements":{
            "type": "object",
            "properties": {
                "textures": {
                    "type": "array",
                    "items": {"$ref": "#/definitions/Texture"}
                },
                "pets": {
                    "type": "array",
                    "items": {"$ref": "#/definitions/Pet"}
                },
                "music": {
                    "type": "array",
                    "items": {"$ref": "#/definitions/Music"}
                },
                "voices": {
                    "type": "object",
                    "properties": {
                        "character": {
                            "type": "array",
                            "items": {"$ref":"#/definitions/CharacterVoice"}
                        },
                        "system": {
                            "type": "array",
                            "items": {"$ref":"#/definitions/SystemVoice"}
                        }
                    }
                },
                "hair_color": {
                    "type": "array",
                    "items": {"$ref":"#/definitions/HairColor"}
                },
                "sound_effects": {
                    "type": "array",
                    "items": {"$ref":"#/definitions/SoundEffect"}
                }
            }
        },
        "Texture": {
            "oneOf":[
                {"$ref":"#/definitions/TexturePath"},
                {"$ref":"#/definitions/AdvancedTexture"}
            ]
        },
        "TexturePath": {
            "type":"string",
            "pattern": "^([a-z]+\/)+.+$"
        },
        "AdvancedTexture": {
            "type":"object",
            "properties": {
                "path": {
                    "$ref":"#/definitions/TexturePath"
                },
                "face_x": {"type":"integer"},
                "face_y": {"type":"integer"},
                "costume_id": {"type":"integer"},
                "custom_name": {"type":"string"},
                "custom_flavor": {"type":"string"},
                "single_file": {"type":"boolean"}
            },
            "required":["path"]
        },
        "Pet": {
            "type": "object",
            "properties": {
                "id": {
                    "type": "string"
                },
                "floating": {
                    "type": "boolean"
                },
                "face_x": {
                    "type": "number"
                },
                "face_y": {
                    "type": "number"
                },
                "textures": {
                    "type": "array",
                    "items": {"$ref":"#/definitions/PetTexture"}
                },
                "layers": {
                    "type": "array",
                    "items": {"$ref":"#/definitions/PetLayer"}
                }
            },
            "required": ["id","textures"]
        },
        "PetTexture": {
            "type": "object",
            "properties": {
                "layer": {
                    "type": "string"
                },
                "path": {
                    "type": "string"
                }
            },
            "required": ["layer","path"]
        },
        "PetLayer": {
            "type": "object",
            "properties": {
                "variant": {
                    "type": "number"
                },
                "layer": {
                    "type": "string",
                    "enum": ["base", "shadow","lineart"]
                },
                "color": {
                    "type": "string"
                },
                "multiply": {
                    "type": "boolean"
                }
            },
            "required": ["variant","layer","color"]
        },
        "Music": {
            "type":"object",
            "properties": {
                "unit_id":{
                    "type":"string"
                },
                "event": {
                    "type":"string"
                },
                "file":{
                    "type":"string"
                },
                "loop_point":{
                    "type":"integer"
                },
                "volume":{
                    "type":"integer",
                    "minimum": -20,
                    "maximum": 20
                }                
            },
            "oneOf":[
                {"required":["event","file"]},
                {"required":["unit_id","file"]}
            ]
        },
        "CharacterVoice": {
            "type":"string",
            "pattern": "^voice_cha_.*$"
        },
        "SystemVoice": {
            "type":"string",
            "pattern": "^voice_sys_.*$"
        },
        "HairColor": {
            "type":"object",
            "properties": {
                "unit_id": {
                    "type":"string"
                },
                "hair_color": {
                    "type":"integer",
                    "minimum": 1,
                    "maximum": 12
                },
                "technique": {
                    "type":"string",
                    "enum": ["texture","singlecolor","gradient"]
                },
                "base_color": {
                    "type":"string"
                },
                "secondary_color": {
                    "type":"string"
                },
                "shadow_color": {
                    "type":"string"
                },
                "add_color": {
                    "type":"string"
                }
            },
            "required": ["unit_id", "hair_color", "technique"]
        },
        "SoundEffect": {
            "type":"string",
            "pattern": "sound/.+\\.wav"
        }
    }
}

const legacyModSchema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "description": "100% Orange Juice Legacy Mod Schema",
    "type": "object",
    "properties": {
        "MOD_NAME": {
            "type": "array",
            "items": {"type":"string"},
            "minItems": 1,
            "maxItems": 1
        },
        "MOD_DESCRIPTION": {
            "type": "array",
            "items": {"type":"string"},
            "minItems": 1,
            "maxItems": 1
        },
        "MOD_AUTHOR": {
            "type": "array",
            "items": {"type":"string"},
            "minItems": 1,
            "maxItems": 1
        },
        "MOD_AUTHOR_CONTACT": {
            "type": "array",
            "items": {"type":"string"},
            "minItems": 1,
            "maxItems": 1
        },
        "MOD_REPLACEMENTS": {
            "type": "array",
            "items": {"$ref":"#/definitions/TexturePath"}
        }
    },
    "required": ["MOD_NAME","MOD_AUTHOR","MOD_DESCRIPTION"],
    "definitions": {
        "TexturePath": {
            "type":"string",
            "pattern": "^([a-z]+\/)+.+$"
        }
    }
}